import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";

export const getLeads = async (req: Request, res: Response) => {
  const { status, rating } = req.query;

  const where: any = {};

  if (status) where.status = status;
  if (rating) where.rating = rating;

  const [total, item] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      include: {
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        activities: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  res.status(200).json({ total, data: item });
};

export const createLead = async (req: Request, res: Response) => {
  const data: Prisma.LeadCreateInput = req.body;

  const lead = await prisma.lead.create({
    data,
  });
  res.status(201).json({ message: "Lead created successfully", data: lead });
};

export const convertLeadToContact = async (req: Request, res: Response) => {
  const { id } = req.params;

  const lead = await prisma.lead.findUnique({
    where: {
      id,
    },
    include: { activities: true },
  });

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  if (lead.status === "Converted") {
    return res.status(400).json({ message: "Lead already converted" });
  }

  const result = await prisma.$transaction(async (tx) => {
    // Create contact from lead data
    const contact = await tx.contact.create({
      data: {
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        leadSource: lead.leadSource,
        customerType: "Prospect",
      },
    });

    // Update lead status and link to contact
    const updatedLead: Prisma.LeadUpdateInput = await tx.lead.update({
      where: {
        id,
      },
      data: {
        status: "Converted",
        convertedDate: new Date(),
        convertedContactId: contact.id,
      },
    });

    // Transfer activities from lead to contact
    if (lead.activities.length > 0) {
      await Promise.all(
        lead.activities.map((activity) => {
          tx.activity.update({
            where: { id: activity.id },
            data: {
              contactId: contact.id,
              leadId: null,
            },
          });
        })
      );
    }

    return { contact, lead: updatedLead };
  });

  res
    .status(200)
    .json({ message: "Lead converted successfully", data: result });
};

export const getLead = async (req: Request, res: Response) => {
  const { id } = req.params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      assignedTo: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      activities: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });
  res.status(200).json(lead);
};
