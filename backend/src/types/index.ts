import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: "AGENT" | "MANAGER" | "ADMIN" | "SUPPORT";
  isVerified: boolean;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role?: "AGENT" | "MANAGER" | "ADMIN" | "SUPPORT";
  phone?: string;
  department?: string;
}
