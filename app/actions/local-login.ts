"use server";
import { supabase } from "@/lib/supabase";

export async function loginUser(phone: string, password: string) {
  try {
    const formattedPhone = phone.startsWith("+234")
      ? phone
      : `+234${phone.substring(1)}`;

    const { data, error } = await supabase.auth.signInWithPassword({
      phone: formattedPhone,
      password,
    });

    if (error) throw error;

    return {
      data: {
        user: data.user,
        session: data.session,
      },
      error: null,
    };
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Login failed"),
    };
  }
}

export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error : new Error("Logout failed"),
    };
  }
}
