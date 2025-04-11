import { NextResponse } from "next/server";
import { logoutUser } from "../../actions/local-login";

export async function POST() {
  try {
    const { error } = await logoutUser();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Logout failed" },
      { status: 500 }
    );
  }
}
