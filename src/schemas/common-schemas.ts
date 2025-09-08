import z from "zod";

export const positiveIntSchema = z.coerce.number().int().min(1);
