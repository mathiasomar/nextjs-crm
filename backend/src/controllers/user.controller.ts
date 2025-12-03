import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";

export const createUser = async (req: Request, res: Response) => {};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { search, department, role } = req.query;
    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: "insensitive" } },
        { lastName: { contains: search as string, mode: "insensitive" } },
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
          firstName: true,
          lastName: true,
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
