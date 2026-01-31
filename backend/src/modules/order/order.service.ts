// Order Service
import prisma from "../../prisma";
import { generateOrderNumber } from "../../utils/idGenerator.util";

export async function createOrder(data: {
  userId?: number;
  name: string;
  phone: string;
  address: string;
  paymentMethod: "COD" | "UPI";
  items: { productId: number; quantity: number }[];
}) {
  const products = await prisma.product.findMany({
    where: {
      id: { in: data.items.map(i => i.productId) },
    },
  });

  let totalAmount = 0;

  const orderItems = data.items.map(item => {
    const product = products.find(p => p.id === item.productId)!;
    totalAmount += product.price * item.quantity;

    return {
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
    };
  });

  return prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: data.userId,
      name: data.name,
      phone: data.phone,
      address: data.address,
      paymentMethod: data.paymentMethod,
      totalAmount,
      items: {
        create: orderItems,
      },
    },
    include: {
      items: true,
    },
  });
}
