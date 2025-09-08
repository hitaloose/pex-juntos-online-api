import z from "zod";

export const signupSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  passwordConfirmation: z.string(),
  phoneWhatsapp: z.string(),
  neighborhood: z.string(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});
