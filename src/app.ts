import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes will be added here
app.get('/', (req, res) => {
  res.json({ message: 'Library Management API' });
});

// Error handling middleware - bunu tüm route'lardan sonra ekleyin
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 