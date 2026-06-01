import { config } from 'dotenv';
import { configSchema } from './schemas/config-schemas.js';

config();

export const CONFIG = configSchema.parse(process.env);
