import 'express';

import { User } from '../models/user.js';

declare global {
  namespace Express {
    interface Request {
      userId: number;
      user: User;
    }
  }
}
