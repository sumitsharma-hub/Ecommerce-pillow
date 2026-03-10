// product.service.ts
import prisma from "../../prisma";
import { generateProductCode } from "../../utils/idGenerator.util";

export function getAllProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      productCode: true,
      name: true,
      description: true,
      ingredients: true,
      price: true,
      mrp: true,
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
  ingredients?: string;
  price: number;
  mrp?: number;
  category: string;
  images: string[];
}) {
  return prisma.product.create({
    data: {
      productCode: generateProductCode(),
      name: data.name,
      description: data.description,
      ingredients: data.ingredients,
      price: data.price,
      mrp: data.mrp,
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
    ingredients?: string;
    price?: number;
    mrp?: number;
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
            deleteMany: {},
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