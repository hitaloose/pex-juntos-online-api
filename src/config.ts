import { config } from "dotenv";
import { configSchema } from "./schemas/config-schemas";

config();

export const CONFIG = configSchema.parse(process.env);
