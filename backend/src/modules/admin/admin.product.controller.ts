import { Request, Response } from "express";
import * as ProductService from "../product/product.service";
import prisma from "../../prisma";
import { generateProductCode } from "../../utils/idGenerator.util";

export async function createProduct(req: Request, res: Response) {
  const { name, price, category, description } = req.body;

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
      category,
      description,
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
  const { name, price, category, description } = req.body;

  let imageOps = {};

  if (req.files && req.files instanceof Array && req.files.length > 0) {
    const imageUrls = req.files.map((file) => {
      const f = file as Express.Multer.File;
      return `/uploads/products/${f.filename}`;
    });

    imageOps = {
      images: {
        deleteMany: {},
        create: imageUrls.map((url, index) => ({
          url,
          position: index,
        })),
      },
    };
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      price: Number(price),
      category,
      description,
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
