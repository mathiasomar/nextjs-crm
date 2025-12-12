import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { User } from "../types";
import { prisma } from "../lib/prisma";

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate tokens
export const generateTokens = (user: User) => {
  const options: SignOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  } as SignOptions;

  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    options
  );

  const refreshToken = uuidv4();

  return { accessToken, refreshToken };
};

// Create session
export const createSession = async (
  userId: string,
  userAgent?: string,
  ipAddress?: string
) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  return prisma.session.create({
    data: {
      userId,
      userAgent,
      ipAddress,
      expiresAt,
    },
  });
};

// Revoke session
export const revokeSession = async (sessionId: string) => {
  return prisma.session.delete({
    where: { id: sessionId },
  });
};
