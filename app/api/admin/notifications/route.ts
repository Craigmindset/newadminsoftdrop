import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";

type NotificationTarget = "all" | "senders" | "carriers";

type SendNotificationBody = {
  title: string;
  message: string;
  target: NotificationTarget;
  priority?: "high" | "medium" | "low";
};

function isValidExpoToken(token: string) {
  return (
    token.startsWith("ExponentPushToken[") || token.startsWith("ExpoPushToken[")
  );
}

async function sendExpoMessages(
  messages: Array<{
    to: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }>,
) {
  const chunkSize = 100;
  const chunks: (typeof messages)[] = [];
  for (let i = 0; i < messages.length; i += chunkSize) {
    chunks.push(messages.slice(i, i + chunkSize));
  }

  const results: Array<{ ok: boolean; error?: string }> = [];

  for (const chunk of chunks) {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chunk),
    });

    if (!response.ok) {
      results.push({
        ok: false,
        error: `Expo push request failed: ${response.status}`,
      });
      continue;
    }

    const payload = await response.json();
    if (payload?.data?.length) {
      const chunkResults = payload.data.map((entry: any) => ({
        ok: entry.status === "ok",
        error: entry.status === "error" ? entry.message : undefined,
      }));
      results.push(...chunkResults);
    }
  }

  return results;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SendNotificationBody;
    const title = body?.title?.trim();
    const message = body?.message?.trim();
    const target = body?.target || "all";

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required." },
        { status: 400 },
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    const [senderResult, carrierResult] = await Promise.all([
      target === "carriers"
        ? Promise.resolve({ data: [] as any[], error: null })
        : supabaseAdmin
            .from("sender_profile")
            .select("expo_push_token")
            .not("expo_push_token", "is", null),
      target === "senders"
        ? Promise.resolve({ data: [] as any[], error: null })
        : supabaseAdmin
            .from("carrier_profile")
            .select("expo_push_token")
            .not("expo_push_token", "is", null),
    ]);

    if (senderResult.error || carrierResult.error) {
      return NextResponse.json(
        { error: "Failed to load push tokens." },
        { status: 500 },
      );
    }

    const tokens = Array.from(
      new Set(
        [...(senderResult.data || []), ...(carrierResult.data || [])]
          .map((row) => String(row.expo_push_token || "").trim())
          .filter((token) => token && isValidExpoToken(token)),
      ),
    );

    if (!tokens.length) {
      const { error: insertError } = await supabaseAdmin
        .from("admin_notification")
        .insert({
          title,
          message,
          target,
          priority: body.priority || "medium",
          sent_count: 0,
          failed_count: 0,
        });

      if (insertError) {
        console.error("Failed to save notification history", insertError);
      }

      return NextResponse.json({
        success: true,
        sent: 0,
        failed: 0,
        message: "No valid Expo push tokens found.",
      });
    }

    const expoMessages = tokens.map((token) => ({
      to: token,
      title,
      body: message,
      data: {
        target,
        priority: body.priority || "medium",
      },
    }));

    const results = await sendExpoMessages(expoMessages);
    const sent = results.filter((result) => result.ok).length;
    const failed = results.length - sent;

    const { error: insertError } = await supabaseAdmin
      .from("admin_notification")
      .insert({
        title,
        message,
        target,
        priority: body.priority || "medium",
        sent_count: sent,
        failed_count: failed,
      });

    if (insertError) {
      console.error("Failed to save notification history", insertError);
    }

    return NextResponse.json({ success: true, sent, failed });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send notification." },
      { status: 500 },
    );
  }
}

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin();

  const { data, error } = await supabaseAdmin
    .from("admin_notification")
    .select(
      "id,title,message,target,priority,created_at,sent_count,failed_count",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Failed to load notification history." },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: data || [] });
}
