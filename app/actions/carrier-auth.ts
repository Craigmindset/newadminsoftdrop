"use server";
import { supabase } from "@/lib/supabase";
import type { CarrierAuthResponse } from "@/types/carrier-auth";

export async function signUpCarrier(
  phone: string,
  password: string
): Promise<CarrierAuthResponse> {
  try {
    const formattedPhone = phone.startsWith("+234")
      ? phone
      : `+234${phone.substring(1)}`;

    const { data, error } = await supabase.auth.signUp({
      phone: formattedPhone,
      password,
      options: {
        data: {
          phone_number: formattedPhone,
          role: "carrier",
        },
      },
    });

    return {
      data: {
        user: data.user
          ? {
              id: data.user.id,
              phone: data.user.phone,
            }
          : null,
        session: data.session
          ? {
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
            }
          : null,
      },
      error,
    };
  } catch (error: any) {
    return {
      data: {},
      error: new Error(error?.message || "Failed to sign up carrier"),
    };
  }
}

export async function verifyCarrierOtp(
  phone: string,
  token: string
): Promise<CarrierAuthResponse> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });

    return {
      data: {
        user: data.user
          ? {
              id: data.user.id,
              phone: data.user.phone,
            }
          : null,
        session: data.session
          ? {
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
            }
          : null,
      },
      error,
    };
  } catch (error: any) {
    return {
      data: {},
      error: new Error(error?.message || "Failed to verify OTP"),
    };
  }
}
