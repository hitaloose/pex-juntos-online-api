import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;
import { CONFIG } from '../config.js';

export const encode = (id: number) => {
  return sign({ id }, CONFIG.JWT_SECRET, {
    expiresIn: `${CONFIG.JWT_EXPIRES_IN_HOURS}Hours`,
  });
};

export const decode = (token: string) => {
  const decoded = verify(token, CONFIG.JWT_SECRET) as { id: number };

  return decoded.id;
};
