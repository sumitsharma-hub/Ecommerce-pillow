import { Request, Response } from "express";
import * as ProductService from "../product/product.service";
import prisma from "../../prisma";
import { generateProductCode } from "../../utils/idGenerator.util";

export async function createProduct(req: Request, res: Response) {
  const { name, price, mrp, category, description, ingredients } = req.body;

  if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
    return res.status(400).json({ message: "At least one image is required" });
  }

  const imageUrls = req.files.map((file) => {
    const f = file as Express.Multer.File;
    return `/uploads/products/${f.filename}`;
  });

  const product = await prisma.product.create({
    data: {
      productCode: generateProductCode(),
      name,
      price: Number(price),
      mrp: mrp ? Number(mrp) : undefined,
      category,
      description,
      ingredients,
      images: {
        create: imageUrls.map((url, index) => ({
          url,
          position: index,
        })),
      },
    },
    include: { images: true },
  });

  res.json(product);
}

export async function updateProduct(req: Request, res: Response) {
  const productId = Number(req.params.id);
  const { name, price, mrp, category, description, ingredients } = req.body;

  let imageOps = {};

  // Handle existingImageIds — keep specified images, add new uploads
  const existingImageIds = req.body.existingImageIds;
  const parsedExistingIds: number[] = Array.isArray(existingImageIds)
    ? existingImageIds.map(Number)
    : existingImageIds
      ? [Number(existingImageIds)]
      : [];

  if (req.files && req.files instanceof Array && req.files.length > 0) {
    const imageUrls = req.files.map((file) => {
      const f = file as Express.Multer.File;
      return `/uploads/products/${f.filename}`;
    });

    // Get the max position from existing images
    const existingCount = parsedExistingIds.length;

    imageOps = {
      images: {
        deleteMany: parsedExistingIds.length
          ? { id: { notIn: parsedExistingIds } }
          : {},
        create: imageUrls.map((url, index) => ({
          url,
          position: existingCount + index,
        })),
      },
    };
  } else if (parsedExistingIds.length > 0) {
    // No new files, but existing image IDs specified — delete ones not in the list
    imageOps = {
      images: {
        deleteMany: { id: { notIn: parsedExistingIds } },
      },
    };
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      price: Number(price),
      mrp: mrp ? Number(mrp) : undefined,
      category,
      description,
      ingredients,
      ...imageOps,
    },
    include: { images: true },
  });

  res.json(product);
}

export async function deleteProduct(req: Request, res: Response) {
  await ProductService.deleteProduct(Number(req.params.id));
  res.json({ message: "Product deleted" });
}
