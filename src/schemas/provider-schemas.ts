import z from "zod";
import { imageFileSchema } from "./common-schemas";

export const providerSchema = z.object({
  name: z.string(),
  phoneWhatsapp: z.string(),
  neighborhood: z.string(),
  image: imageFileSchema.optional(),
});
