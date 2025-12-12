import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { Prisma } from "../../generated/prisma/client";

export const getContacts = async (req: Request, res: Response) => {
  // Query params: search:q, tag, orgId(organization scope), ownerId, page, limit
  const { search, customerType, status } = req.query;

  const where: any = {};

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (customerType && customerType !== "all") {
    where.customerType = customerType;
  }
  if (status) where.status = status;

  const [total, item] = await Promise.all([
    prisma.contact.count({ where }),
    prisma.contact.findMany({
      where,
      include: {
        household: true,
        opportunities: true,
        transactions: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return res.status(200).json({ meta: total, data: item });
};

export const createContact = async (req: Request, res: Response) => {
  const data: Prisma.ContactCreateInput = req.body;

  const checkContact = await prisma.contact.findUnique({
    where: { email: data.email },
  });
  if (checkContact)
    return res.status(400).json({ message: "Contact already exists" });

  const contact = await prisma.contact.create({
    data,
  });

  res
    .status(201)
    .json({ message: "Contact created successfully", data: contact });
};

export const getContact = async (req: Request, res: Response) => {
  const { id } = req.params;
  const contact = await prisma.contact.findUnique({
    where: { id: id },
    include: {
      household: true,
      opportunities: {
        include: {
          assignedTo: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      cases: true,
      activities: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      notes: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  res.status(200).json(contact);
};

export const updateContact = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const checkContact = await prisma.contact.findUnique({
    where: { id },
  });
  if (!checkContact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  const contact = await prisma.contact.update({
    where: { id },
    data,
  });
  res
    .status(200)
    .json({ message: "Contact updated successfully", data: contact });
};

export const deleteContact = async (req: Request, res: Response) => {
  const { id } = req.params;

  const checkContact = await prisma.contact.findUnique({
    where: { id: id },
  });
  if (!checkContact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  const contact = await prisma.contact.delete({
    where: { id: id },
  });
  res
    .status(200)
    .json({ message: "Contact deleted successfully", data: contact });
};

export const getContactsByHousehold = async (req: Request, res: Response) => {
  const { id } = req.params;
  const contacts = await prisma.contact.findMany({
    where: { householdId: id },
  });
  res.status(200).json(contacts);
};

export const getContactActivities = async (req: Request, res: Response) => {
  const { id } = req.params;
  const activities = await prisma.activity.findMany({
    where: { contactId: id },
    include: {
      assignedTo: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json(activities);
};

export const createContactActivity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const [activity, updateContact] = await prisma.$transaction([
    prisma.activity.create({
      data: {
        ...data,
        contactId: id,
      },
      include: {
        assignedTo: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.contact.update({
      where: { id },
      data: { lastActivityAt: new Date() },
    }),
  ]);

  res.status(201).json({
    message: "Activity created successfully",
    activityData: activity,
    updateContactData: updateContact,
  });
};
