import prisma from "../../prisma";

export function getReviews(productId: number) {
  return prisma.review.findMany({
    where: { productId },
    include: {
      user: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function addReview(data: {
  productId: number;
  userId: number;
  rating: number;
  comment?: string;
}) {
  return prisma.review.create({
    data,
  });
}


// review.service.ts
export async function updateReview(
  reviewId: number,
  userId: number,
  data: { rating: number; comment?: string }
) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return prisma.review.update({
    where: { id: reviewId },
    data,
  });
}

export async function deleteReview(reviewId: number, userId: number) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return prisma.review.delete({
    where: { id: reviewId },
  });
}
