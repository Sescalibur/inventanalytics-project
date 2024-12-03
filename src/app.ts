import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { AppDataSource } from './config/database';
import userRoutes from './routes/userRoutes';
import bookRoutes from './routes/bookRoutes';
import { apiLimiter, bookViewLimiter } from './middleware/rateLimiter';
import { securityConfig } from './config/security';

// Load environment variables
config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(securityConfig);
app.use(morgan('dev'));
app.use(express.json());

// Rate limiters
app.use('/api/', apiLimiter);
app.use('/api/books', bookViewLimiter);

// Database bağlantısını başlat ve sonra sunucuyu başlat
AppDataSource.initialize()
  .then(() => {
    console.log('✅ PostgreSQL bağlantısı başarılı!');

    // Routes
    app.use('/api/users', userRoutes);
    app.use('/api/books', bookRoutes);

    // Error handling middleware
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      errorHandler(err, req, res, next);
    });

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Database bağlantı hatası:', error);
  });

export default app; 