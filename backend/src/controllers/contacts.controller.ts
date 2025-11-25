import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export const getContacts = async (req: Request, res: Response) => {
  // Query params: search:q, tag, orgId(organization scope), ownerId, page, limit
  const { q, tag, orgId, ownerId } = req.query;
  const where: any = {
    organizationId: Number(orgId),
  };

  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  if (ownerId) where.ownerId = Number(ownerId);
  if (tag) where.tags = { some: { tag: tag as string } };
  const contacts = await prisma.contact.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json(contacts);
};

export const createContact = async (req: Request, res: Response) => {
  const data = req.body;
  const { tags, ...contactData } = data;

  const contact = await prisma.contact.create({
    data: {
      ...contactData,
      tags: { create: tags?.map((t: string) => ({ tag: t })) },
    },
  });

  res.status(201).json(contact);
};

export const getContact = async (req: Request, res: Response) => {};
export const updateContact = async (req: Request, res: Response) => {};
export const deleteContact = async (req: Request, res: Response) => {};
