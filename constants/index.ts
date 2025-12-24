export const baseUrl = "https://api.softdrop.tech"

export const ENDPOINTS = {
  login: "/auth/login",
  refreshAuthKey: "/auth/refresh",
  users: "/admin/users",
  dashboard: "/admin/dashboard",
  transactions: "/admin/transactions"
};

export const STORAGE_KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  userPhone: "userPhone",
};