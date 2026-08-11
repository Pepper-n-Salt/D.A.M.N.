export interface AuthUser {
  id: string;
  organisationId: string;
  role: "super" | "admin" | "user";
}
