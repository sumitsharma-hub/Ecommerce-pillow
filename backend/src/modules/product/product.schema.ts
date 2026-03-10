// product.schema.ts
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
  mrp: z.number().positive().optional(),
  category: z.string().min(2),
  description: z.string().optional(),
  ingredients: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();