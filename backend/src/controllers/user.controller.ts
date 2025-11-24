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

    const clerkId = data.id;
    const email = data.email ?? data.email_addresses?.[0]?.email_address;
    const firstName = data.first_name ?? data.firstName ?? undefined;
    const lastName = data.last_name ?? data.lastName ?? undefined;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user: Prisma.UserCreateInput = await prisma.user.create({
      data: {
        clerkId,
        email,
        firstName,
        lastName,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
