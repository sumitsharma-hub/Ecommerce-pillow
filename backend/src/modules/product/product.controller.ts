import { Request, Response } from "express";
import * as ProductService from "./product.service";

/** PUBLIC */
export async function listProducts(_req: Request, res: Response) {
  const products = await ProductService.getAllProducts();
  res.json(products);
}

/** ADMIN */
export async function createProduct(req: Request, res: Response) {
  const product = await ProductService.createProduct(req.body);
  res.status(201).json(product);
}

/** ADMIN */
export async function updateProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  const product = await ProductService.updateProduct(id, req.body);
  res.json(product);
}

/** ADMIN */
export async function deleteProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  await ProductService.deleteProduct(id);
  res.json({ message: "Product deleted successfully" });
}

// product.controller.ts
export async function getProductDetails(req: Request, res: Response) {
  const { productCode } = req.params;

  const product = await ProductService.getProductByCode(productCode);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
}
