import z from "zod";

export const positiveIntSchema = z.coerce.number().int().min(1);

export const imageFileSchema = z
  .custom<Express.Multer.File>()
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype),
    "Imagem inválida"
  );
