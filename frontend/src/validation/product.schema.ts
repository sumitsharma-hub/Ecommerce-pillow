import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(3, "Name is required"),
  price: z.number().positive("Price must be greater than 0"),
  category: z.string().min(2, "Category is required"),
  description: z.string().optional(),
  images: z
    .array(z.any())
    .min(1, "At least one image is required"),
});
