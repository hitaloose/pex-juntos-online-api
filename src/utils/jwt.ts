import { sign, verify } from "jsonwebtoken";
import { CONFIG } from "../config";

export const encode = (id: number) => {
  return sign({ id }, CONFIG.JWT_SECRET, { expiresIn: CONFIG.JWT_EXPIRES_IN });
};

export const decode = (token: string) => {
  const decoded = verify(token, CONFIG.JWT_SECRET) as { id: number };

  return decoded.id;
};
