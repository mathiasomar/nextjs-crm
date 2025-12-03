import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";
import { auth } from "../lib/auth";

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, role, department, phone } =
    req.body;
  const name = `${firstName} ${lastName}`.trim();

  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });

  if (!result.user) {
    return res.status(400).json({ error: "Failed to create user" });
  }

  await prisma.user.update({
    where: { id: result.user.id },
    data: {
      role,
      department,
      phone,
    },
  });
  res.status(201).json(result.user);
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (!result.user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  res
    .status(200)
    .json({ message: "User verified successfuly", data: result.user });
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { search, department, role } = req.query;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (department) where.department = department;
    if (role) where.role = role;

    const [total, item] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          department: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    res.status(200).json({ total, data: item });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
