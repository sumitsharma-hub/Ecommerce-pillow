import prisma from "../../prisma";

export async function addToCart(
  userId: number,
  productId: number,
  quantity = 1
) {
  return prisma.cartItem.upsert({
    where: {
      userId_productId: { userId, productId },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      userId: userId,
      productId: productId,
      quantity: quantity,
    },
  });
}

export async function buyNow(userId: number, productId: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) throw new Error("Product not found");

  return {
    product,
    amount: product.price,
  };
}
