import z from "zod";
import { imageFileSchema } from "./common-schemas";

export const searchAdsSchema = z.object({
  q: z.string().optional().default(""),
  category: z.string().optional().default(""),
  neighborhood: z.string().optional().default(""),
  providerId: z.coerce.number().int().min(1).optional(),
});

export const adSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  image: imageFileSchema.optional(),
});
