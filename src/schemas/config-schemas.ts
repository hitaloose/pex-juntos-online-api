import z from "zod";
import { DbDialect } from "../types/db-dialect";

export const configSchema = z.object({
  DEFAULT_ADMIN_EMAIL: z.email().optional(),
  DEFAULT_ADMIN_PASSWORD: z.string().min(3).optional(),

  API_PORT: z.coerce.number(),

  DB_DIALECT: z.enum(DbDialect),
  DB_STORAGE: z.string().optional().default(""),

  BCRYPT_SALTS: z.coerce.number().optional().default(10),

  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.coerce
    .number()
    .optional()
    .default(30 * 24 * 60 * 1000),
});
