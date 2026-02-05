// Product Service
import prisma from "../../prisma";
import { generateProductCode } from "../../utils/idGenerator.util";

export function getAllProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      productCode: true, // ✅ REQUIRED
      name: true,
      description: true,
      price: true,
      category: true,
      images: {
        orderBy: { position: "asc" },
      },
    },
  });
}


export function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  category: string;
  images: string[];
}) {
  return prisma.product.create({
    data: {
      productCode: generateProductCode(),
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      images: {
        create: data.images.map((url, index) => ({
          url,
          position: index,
        })),
      },
    },
    include: {
      images: true,
    },
  });
}


export function updateProduct(
  id: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    images?: string[];
  }
) {
  const { images, ...productData } = data;

  return prisma.product.update({
    where: { id },
    data: {
      ...productData,
      images: images
        ? {
            deleteMany: {}, // remove old images
            create: images.map((url, index) => ({
              url,
              position: index,
            })),
          }
        : undefined,
    },
    include: {
      images: true,
    },
  });
}


export function deleteProduct(id: number) {
  return prisma.product.delete({
    where: { id },
  });
}


export function getProductByCode(productCode: string) {
  return prisma.product.findUnique({
    where: { productCode },
    include: {
      images: {
        orderBy: { position: "asc" },
      },
    },
  });
}