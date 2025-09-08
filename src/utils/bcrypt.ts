import { hash as bcryptHash, compare as bcryptCompare } from "bcrypt";
import { CONFIG } from "../config";

export const hash = (value: string) => {
  return bcryptHash(value, CONFIG.BCRYPT_SALTS);
};

export const compare = (value: string, hash: string) => {
  return bcryptCompare(value, hash);
};
