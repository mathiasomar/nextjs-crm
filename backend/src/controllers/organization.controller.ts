import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";

export const createOrganization = async (req: Request, res: Response) => {
  const data = req.body;

  const org: Prisma.OrganizationCreateInput = await prisma.organization.create({
    data,
  });

  return res.status(201).json(org);
};
export const getOrganizations = async (req: Request, res: Response) => {
  const orgs = await prisma.organization.findMany();
  return res.status(200).json(orgs);
};

export const getOrganizationMe = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId)
    return res.status(401).json({ message: "You are not logged in" });
  const org = await prisma.organizationUser.findUnique({
    where: { userId: userId as string },
    include: { organization: true },
  });
  return res.status(200).json(org);
};

export const createOrganizationUser = async (req: Request, res: Response) => {
  const data = req.body;
  const userId = req.userId;

  if (!userId)
    return res.status(401).json({ message: "You are not logged in" });

  const checkUser = await prisma.organizationUser.findUnique({
    where: { userId: userId as string },
  });
  if (checkUser)
    return res.status(400).json({ message: "User already exists" });

  const org = await prisma.organizationUser.create({
    data: {
      userId,
      role: data.role,
      organization: { connect: { id: data.organizationId } },
    },
  });

  return res.status(201).json(org);
};
