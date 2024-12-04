import Redis from 'ioredis';

let redis: Redis | null = null;

try {
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  });

  redis.on('error', (err) => {
    console.warn('Redis connection failed, continuing without cache:', err.message);
    redis = null;
  });

  redis.on('connect', () => console.log('✅ Redis Client Connected'));
} catch (error) {
  console.warn('Redis initialization failed, continuing without cache');
}

export default redis; 