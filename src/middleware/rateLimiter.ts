import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // IP başına max istek sayısı
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes',
    code: 429
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Kitap görüntüleme için daha yüksek limit
export const bookViewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    status: 'error',
    message: 'Too many book view requests, please try again after 15 minutes',
    code: 429
  }
}); 