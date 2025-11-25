import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export const getContacts = async (req: Request, res: Response) => {
  // Query params: search:q, tag, orgId(organization scope), ownerId, page, limit
  const { q, tag, orgId, ownerId } = req.query;
  const contacts = await prisma.contact.findMany({
    where: {
      OR: [
        { firstName: { contains: q as string, mode: "insensitive" } },
        { lastName: { contains: q as string, mode: "insensitive" } },
        { email: { contains: q as string, mode: "insensitive" } },
      ],
    },
  });

  return res.status(200).json(contacts);
};
export const createContact = async (req: Request, res: Response) => {};
export const getContact = async (req: Request, res: Response) => {};
export const updateContact = async (req: Request, res: Response) => {};
export const deleteContact = async (req: Request, res: Response) => {};
