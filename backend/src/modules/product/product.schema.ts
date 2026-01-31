import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
  category: z.string().min(2),
  description: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();
