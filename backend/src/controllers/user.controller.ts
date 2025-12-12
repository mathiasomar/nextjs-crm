import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

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
          isVerified: true,
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
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            assignedLeads: true,
            assignedActivities: true,
            assignedCases: true,
            assignedOpportunities: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteManyUser = async (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: "ids must be array" });
  }

  const deleted = await prisma.user.deleteMany({
    where: { id: { in: ids } },
  });

  res
    .status(200)
    .json({ deletedCount: deleted.count, message: "User(s) deleted" });
};
