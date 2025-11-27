import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export const getProducts = async (req: Request, res: Response) => {
  const { search, category, inActive } = req.query;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) where.category = category;
  if (inActive !== undefined) where.inActive = inActive === "true";

  const [total, item] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({ where, orderBy: { createdAt: "desc" } }),
  ]);

  res.status(200).json({ total, data: item });
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: id },
  });
  res.status(200).json(product);
};

export const createProduct = async (req: Request, res: Response) => {
  const data = req.body;

  const checkProduct = await prisma.product.findUnique({
    where: { sku: data.sku },
  });
  if (checkProduct)
    return res.status(400).json({ message: "Product already exists" });

  const product = await prisma.product.create({
    data: {
      ...data,
      price: data.price ? parseFloat(data.price) : 0,
      cost: data.cost ? parseFloat(data.cost) : 0,
    },
  });
  res
    .status(201)
    .json({ message: "Product created successfully", data: product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const checkProduct = await prisma.product.findUnique({
    where: { id },
  });
  if (!checkProduct) {
    return res.status(404).json({ message: "Product not found" });
  }
  const product = await prisma.product.update({
    where: { id: id },
    data: {
      ...data,
      price: data.price ? parseFloat(data.price) : 0,
      cost: data.cost ? parseFloat(data.cost) : 0,
    },
  });
  res
    .status(200)
    .json({ message: "Product updated successfully", data: product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const checkProduct = await prisma.product.findUnique({
    where: { id: id },
  });
  if (!checkProduct) {
    return res.status(404).json({ message: "Product not found" });
  }
  const product = await prisma.product.delete({
    where: { id: id },
  });
  res
    .status(200)
    .json({ message: "Product deleted successfully", data: product });
};
