import { Request, Response, NextFunction } from 'express';
import { cache } from '../utils/cache.js';

export const cacheMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = req.originalUrl;

  const cachedData = cache.get(key);
  if (cachedData) {
    res.json(cachedData);
    return;
  }

  const originalJson = res.json.bind(res);
  res.json = (data: unknown) => {
    cache.set(key, data);
    return originalJson(data);
  };

  next();
};
