import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import * as CartService from "./cart.service";

export async function addToCart(req: AuthRequest, res: Response) {
  const { productId, quantity } = req.body;

  await CartService.addToCart(
    req.user!.id,
    productId,
    quantity
  );

  res.json({ message: "Added to cart" });
}

export async function buyNow(req: AuthRequest, res: Response) {
  const { productId } = req.body;

  const data = await CartService.buyNow(req.user!.id, productId);
  res.json(data);
}
