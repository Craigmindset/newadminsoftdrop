import type { AdminRole } from "@/lib/supabase";

export type Permission =
  | "dashboard:view"
  | "dashboard:revenue:view"
  | "dashboard:wallet-card:view"
  | "senders:view"
  | "carriers:view"
  | "transactions:view"
  | "wallet:view"
  | "wallet:transfer:view"
  | "wallet:payouts:view"
  | "disputes:view"
  | "notifications:view"
  | "analytics:view"
  | "roles:view"
  | "settings:view"
  | "settings:transaction-pin:view";

export const ROLE_PERMISSIONS: Record<AdminRole, Array<Permission | "*">> = {
  super_admin: ["*"],
  manager: [
    "dashboard:view",
    "dashboard:revenue:view",
    "dashboard:wallet-card:view",
    "senders:view",
    "carriers:view",
    "transactions:view",
    "disputes:view",
    "notifications:view",
    "settings:view",
  ],
  finance: [
    "dashboard:view",
    "dashboard:revenue:view",
    "dashboard:wallet-card:view",
    "senders:view",
    "carriers:view",
    "transactions:view",
    "wallet:view",
    "wallet:transfer:view",
    "wallet:payouts:view",
    "analytics:view",
    "settings:view",
  ],
  support: [
    "dashboard:view",
    "senders:view",
    "carriers:view",
    "disputes:view",
    "notifications:view",
    "settings:view",
  ],
  marketing: [
    "dashboard:view",
    "senders:view",
    "carriers:view",
    "notifications:view",
    "analytics:view",
    "settings:view",
  ],
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
