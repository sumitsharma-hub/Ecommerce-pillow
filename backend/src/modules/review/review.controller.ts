import { Request, Response } from "express";
import prisma from "../../prisma";
import { AuthRequest } from "../auth/auth.middleware";
import * as ReviewService from "./review.service";


export async function getProductReviews(req: Request, res: Response) {
  const productId = Number(req.params.productId);

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(reviews);
}

export async function createReview(req: AuthRequest, res: Response) {
  const productId = Number(req.params.productId);
  const userId = req.user!.id;
  const { rating, comment } = req.body;

  // ✅ rating validation
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  // ✅ purchase check (IMPORTANT)
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        paymentStatus: "PAID",
      },
    },
  });

  if (!hasPurchased) {
    return res.status(403).json({
      message: "Only verified buyers can review this product",
    });
  }

  const review = await prisma.review.create({
    data: {
      productId,
      userId,
      rating,
      comment,
    },
  });

  res.status(201).json(review);
}

export async function updateReview(req: AuthRequest, res: Response) {
  const reviewId = Number(req.params.id);
  const userId = req.user!.id;

  const review = await ReviewService.updateReview(
    reviewId,
    userId,
    req.body
  );

  res.json(review);
}

export async function deleteReview(req: AuthRequest, res: Response) {
  const reviewId = Number(req.params.id);
  const userId = req.user!.id;

  await ReviewService.deleteReview(reviewId, userId);
  res.json({ message: "Review deleted" });
}

// GET /reviews/can-review/:productId
export async function canUserReview(req: AuthRequest, res: Response) {
  const productId = Number(req.params.productId);
  const userId = req.user!.id;

  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        paymentStatus: "PAID",
      },
    },
  });

  res.json({ canReview: !!hasPurchased });
}
