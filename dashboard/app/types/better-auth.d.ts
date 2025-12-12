import { DefaultUser, Session } from "better-auth";

declare module "better-auth" {
  // Extend the default User type
  interface User extends DefaultUser {
    phone?: string;
    avatarUrl?: string;
    role?: "AGENT" | "ADMIN" | string;
    department?: string;
    isActive?: boolean;
  }

  // Extend the Session type so session.user has extra fields
  interface Session {
    user: User;
  }
}
