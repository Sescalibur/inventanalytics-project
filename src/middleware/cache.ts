import { Request, Response, NextFunction, RequestHandler } from 'express';
import redis from '../config/redis';

export const cacheMiddleware = (prefix: string, ttl: number = 3600): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!redis) {
      next();
      return;
    }

    try {
      const key = `${prefix}:${req.originalUrl}`;
      const cachedData = await redis.get(key);

      if (cachedData) {
        res.json(JSON.parse(cachedData));
        return;
      }

      const originalJson = res.json.bind(res);
      res.json = ((data: any) => {
        redis?.setex(key, ttl, JSON.stringify(data));
        originalJson(data);
        return;
      }) as any;

      next();
    } catch (error) {
      console.warn('Cache error:', error);
      next();
    }
  };
};

export const clearCache = async (pattern: string): Promise<void> => {
  if (!redis) return;
  
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.warn('Cache clear error:', error);
  }
}; 