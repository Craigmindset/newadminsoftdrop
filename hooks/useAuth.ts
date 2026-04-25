import { hasPermission, type Permission } from "@/constants/rbac";
import { supabase, type AdminProfile } from "@/lib/supabase";
import { useEffect, useState } from "react";

type LoginPayload = {
  email: string;
  password: string;
};

const DEMO_EMAIL = "admin@softdrop.com";
const DEMO_PASSWORD = "1234567";
const DEMO_LOGIN_KEY = "softdropDemoLogin";

function shouldBypassAdminProfileChecks() {
  if (typeof window === "undefined") {
    return false;
  }

  const path = window.location.pathname;
  return path === "/admin/reset-password" || path === "/admin/forgot-password";
}

function getDemoProfile(): AdminProfile {
  return {
    id: "demo-admin",
    email: DEMO_EMAIL,
    role: "super_admin",
    first_name: "Demo",
    last_name: "Admin",
    is_active: true,
  };
}

export default function useAuth() {
  const isDev = process.env.NODE_ENV === "development";
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);

  async function getAdminProfile(userId: string): Promise<AdminProfile | null> {
    if (isDev) {
      console.log("[auth] loading admin_profile", { userId });
    }

    const { data, error } = await supabase
      .from("admin_profile")
      .select(
        "id, email, first_name, last_name, role, is_active, last_login, created_at, updated_at",
      )
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      if (isDev) {
        console.error("[auth] admin_profile query failed", {
          message: error.message,
          code: error.code,
          status: (error as any).status,
        });
      }
      return null;
    }

    if (isDev) {
      console.log("[auth] admin_profile loaded", {
        found: Boolean(data),
        role: data?.role,
        is_active: data?.is_active,
      });
    }

    return data as AdminProfile | null;
  }

  async function syncSession() {
    if (typeof window !== "undefined") {
      const demoActive = window.localStorage.getItem(DEMO_LOGIN_KEY) === "true";
      if (demoActive) {
        setAccessToken("demo-token");
        setAdminProfile(getDemoProfile());
        setIsLoggedIn(true);
        return;
      }
    }

    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (!session?.access_token || !session.user?.id) {
      setAccessToken(null);
      setAdminProfile(null);
      setIsLoggedIn(false);
      return;
    }

    if (shouldBypassAdminProfileChecks()) {
      // Recovery pages should not query admin_profile or force sign-out.
      setAccessToken(session.access_token);
      setAdminProfile(null);
      setIsLoggedIn(false);
      return;
    }

    const profile = await getAdminProfile(session.user.id);
    if (!profile || profile.is_active === false) {
      await supabase.auth.signOut();
      setAccessToken(null);
      setAdminProfile(null);
      setIsLoggedIn(false);
      return;
    }

    setAccessToken(session.access_token);
    setAdminProfile(profile);
    setIsLoggedIn(true);
  }

  async function login(body: LoginPayload, setError: (val: string) => void) {
    const normalizedEmail = body.email.trim().toLowerCase();

    if (isDev) {
      console.log("[auth] login started", { email: normalizedEmail });
    }

    setAuthLoading(true);
    setError("");

    if (normalizedEmail === DEMO_EMAIL && body.password === DEMO_PASSWORD) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(DEMO_LOGIN_KEY, "true");
      }
      setAccessToken("demo-token");
      setAdminProfile(getDemoProfile());
      setIsLoggedIn(true);
      setAuthLoading(false);
      return { success: true };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: body.password,
    });

    if (isDev) {
      console.log("[auth] signInWithPassword response", {
        hasSession: Boolean(data?.session),
        hasUser: Boolean(data?.session?.user?.id),
        errorMessage: error?.message,
        errorStatus: (error as any)?.status,
        errorCode: (error as any)?.code,
      });
    }

    if (error || !data.session?.user?.id) {
      setAuthLoading(false);
      if (error?.message === "Invalid login credentials") {
        setError("invalid email or password credential");
        return {
          success: false,
          error: error.message,
          errorStatus: (error as any)?.status,
          errorCode: (error as any)?.code,
        };
      }

      if (error?.message === "Database error querying schema") {
        setError(
          "Supabase auth schema error. Run the auth.users email_change NULL fix in SQL, then retry.",
        );
        return {
          success: false,
          error: error.message,
          errorStatus: (error as any)?.status,
          errorCode: (error as any)?.code,
        };
      }

      setError(error?.message || "Unable to sign in");
      return {
        success: false,
        error: error?.message || "Unable to sign in",
        errorStatus: (error as any)?.status,
        errorCode: (error as any)?.code,
      };
    }

    const profile = await getAdminProfile(data.session.user.id);
    if (!profile) {
      if (isDev) {
        console.warn("[auth] login blocked: admin profile not found");
      }
      await supabase.auth.signOut();
      setAuthLoading(false);
      setError("No admin profile found for this account");
      return { success: false, error: "No admin profile found for this account" };
    }

    if (profile.is_active === false) {
      if (isDev) {
        console.warn("[auth] login blocked: account inactive");
      }
      await supabase.auth.signOut();
      setAuthLoading(false);
      setError("This admin account is inactive");
      return { success: false, error: "This admin account is inactive" };
    }

    await supabase
      .from("admin_profile")
      .update({ last_login: new Date().toISOString() })
      .eq("id", profile.id);

    setAccessToken(data.session.access_token);
    setAdminProfile(profile);
    setIsLoggedIn(true);
    setAuthLoading(false);

    if (isDev) {
      console.log("[auth] login successful", {
        userId: profile.id,
        role: profile.role,
      });
    }

    return { success: true };
  }

  async function logout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DEMO_LOGIN_KEY);
    }
    try {
      await supabase.auth.signOut();
    } catch (error) {
      if (isDev) {
        console.error("[auth] signOut failed", error);
      }
    } finally {
      setAccessToken(null);
      setAdminProfile(null);
      setIsLoggedIn(false);
    }
  }

  async function refreshAuth(token?: string) {
    if (token) {
      setAccessToken(token);
      return token;
    }

    const { data, error } = await supabase.auth.refreshSession();
    const nextToken = data.session?.access_token || null;
    if (error || !nextToken) {
      return null;
    }

    setAccessToken(nextToken);
    return nextToken;
  }

  useEffect(() => {
    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.access_token || !session.user?.id) {
        setAccessToken(null);
        setAdminProfile(null);
        setIsLoggedIn(false);
        return;
      }

      if (shouldBypassAdminProfileChecks()) {
        // Recovery pages should not query admin_profile or force sign-out.
        setAccessToken(session.access_token);
        setAdminProfile(null);
        setIsLoggedIn(false);
        return;
      }

      const profile = await getAdminProfile(session.user.id);
      if (!profile || profile.is_active === false) {
        await supabase.auth.signOut();
        setAccessToken(null);
        setAdminProfile(null);
        setIsLoggedIn(false);
        return;
      }

      setAccessToken(session.access_token);
      setAdminProfile(profile);
      setIsLoggedIn(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    isLoggedIn,
    authLoading,
    accessToken,
    adminProfile,
    role: adminProfile?.role ?? null,
    can: (permission: Permission) =>
      hasPermission(adminProfile?.role ?? null, permission),
    refreshAuth,
    login,
    logout,
  };
}
