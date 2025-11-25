import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";

export const createUser = async (req: Request, res: Response) => {
  try {
    const evt = await verifyWebhook(req);

    // Only handle user-related events
    if (evt.type !== "user.created" && evt.type !== "user.updated") {
      return res.status(400).json({ error: "Unsupported webhook event" });
    }

    // Narrow the data to any so we can safely pick properties that exist on user payloads
    const data: any = evt.data;

    const clerkUserId = data.id;
    const email = data.email ?? data.email_addresses?.[0]?.email_address;
    const firstName = data.first_name ?? data.firstName ?? undefined;
    const lastName = data.last_name ?? data.lastName ?? undefined;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let user: Prisma.UserCreateInput;

    if (existingUser) {
      // Update the existing user
      user = await prisma.user.update({
        where: { email },
        data: {
          clerkUserId,
          firstName,
          lastName,
        },
      });
    } else {
      // Create a new user
      user = await prisma.user.create({
        data: {
          clerkUserId,
          email,
          firstName,
          lastName,
        },
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error creating/updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await prisma.user.findFirst({ where: { id: Number(userId) } });
  res.status(200).json(user);
};
