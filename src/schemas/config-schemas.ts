import z from "zod";
import { DbDialect } from "../types/db-dialect";

export const configSchema = z.object({
  DEFAULT_ADMIN_EMAIL: z.email().optional(),
  DEFAULT_ADMIN_PASSWORD: z.string().min(3).optional(),

  PORT: z.coerce.number(),

  DB_DIALECT: z.enum(DbDialect),
  DB_STORAGE: z.string().default(""),
  DB_NAME: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),

  BCRYPT_SALTS: z.coerce.number().default(10),

  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN_HOURS: z.coerce.number().default(720),

  R2_BUCKET: z.string(),
  R2_ACCESS_KEY: z.string(),
  R2_SECRET_KEY: z.string(),
  R2_ENDPOINT: z.url(),
  R2_PUBLIC_URL: z.url(),
  FILE_UPLOAD_MAX_SIZE_MB: z.coerce.number().default(5),
});
