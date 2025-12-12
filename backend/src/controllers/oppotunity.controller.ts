import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { Prisma } from "../../generated/prisma/browser";

export const getOpportunities = async (req: Request, res: Response) => {
  const opportunities = await prisma.opportunity.findMany({
    include: {
      assignedTo: {
        select: {
          name: true,
        },
      },
    },
  });
  res.status(200).json(opportunities);
};

export const createOpportunity = async (req: Request, res: Response) => {
  const data: Prisma.OpportunityUncheckedCreateInput = req.body;

  const opportunity = await prisma.opportunity.create({
    data: {
      ...data,
      closeDate: data.closeDate ? new Date(data.closeDate) : null,
    },
    include: {
      assignedTo: {
        select: {
          name: true,
        },
      },
    },
  });
  res
    .status(201)
    .json({ message: "Opportunity created successfully", data: opportunity });
};

export const updateOppotunity = async (req: Request, res: Response) => {
  // change stage; push to audit log
};

export const createOpportunityProducts = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const data: Prisma.OpportunityProductUncheckedCreateInput = req.body;

  const checkOpportunity = await prisma.opportunity.findUnique({
    where: { id },
  });
  if (!checkOpportunity) {
    return res.status(404).json({ message: "Opportunity not found" });
  }

  const opportunityProduct = await prisma.opportunityProduct.create({
    data: {
      ...data,
      opportunityId: id,
    },
    include: {
      product: true,
    },
  });

  res.status(201).json({
    message: "Opportunity product created successfully",
    data: opportunityProduct,
  });
};

export const createOpportunityClose = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { stage, wonDate } = req.body;

  if (!["Closed Won", "Closed Lost"].includes(stage)) {
    return res
      .status(400)
      .json({ error: "Stage must be 'Closed Won' or 'Closed Lost'" });
  }

  const oppotunity = await prisma.opportunity.update({
    where: { id },
    data: {
      stage,
      wonDate: new Date(wonDate || new Date()),
    },
    include: {
      contact: true,
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  // if won create a transaction
  if (stage === "Closed Won") {
    const totalAmount = oppotunity.products.reduce((sum, item) => {
      return sum + (item.totalPrice || 0);
    }, 0);

    await prisma.transaction.create({
      data: {
        orderId: `ORD-${Date.now()}`,
        totalAmount,
        status: "Completed",
        contactId: oppotunity.contactId,
        products: {
          create: oppotunity.products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity ?? 0,
            unitPrice: product.unitPrice ?? 0,
            discount: product.discount ?? 0,
            totalPrice: product.totalPrice ?? 0,
          })) as Prisma.TransactionProductUncheckedCreateWithoutTransactionInput[],
        },
      },
    });
  }

  res.status(200).json({
    message: "Transaction created successfully, opportunity closed",
    data: oppotunity,
  });
};
