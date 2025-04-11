"use server";
import { supabase } from "@/lib/supabase";

export async function loginUser(phone: string, password: string) {
  const formattedPhone = phone.startsWith("+234")
    ? phone
    : `+234${phone.substring(1)}`;

  const { data, error } = await supabase.auth.signInWithPassword({
    phone: formattedPhone,
    password,
  });

  return { data, error };
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  return { error };
}
