import type { AdminRole } from "@/lib/supabase";

export type Permission =
  | "dashboard:view"
  | "senders:view"
  | "carriers:view"
  | "transactions:view"
  | "disputes:view"
  | "notifications:view"
  | "analytics:view"
  | "roles:view"
  | "settings:view";

export const ROLE_PERMISSIONS: Record<AdminRole, Array<Permission | "*">> = {
  super_admin: ["*"],
  manager: [
    "dashboard:view",
    "senders:view",
    "carriers:view",
    "transactions:view",
    "disputes:view",
    "notifications:view",
    "analytics:view",
    "roles:view",
    "settings:view",
  ],
  support: ["dashboard:view", "disputes:view", "notifications:view"],
};

export function hasPermission(
  role: AdminRole | null,
  permission: Permission,
): boolean {
  if (!role) {
    return false;
  }

  const permissions = ROLE_PERMISSIONS[role];
  if (permissions.includes("*")) {
    return true;
  }

  return permissions.includes(permission);
}
