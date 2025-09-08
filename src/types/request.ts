import "express";

import { User } from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: number;
      user: User;
    }
  }
}
