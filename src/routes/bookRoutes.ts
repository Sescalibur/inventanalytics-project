import { Router } from 'express';
import { BookController } from '../controllers/bookController';
import { validateRequest } from '../middleware/validateRequest';
import { createBookSchema } from '../validations/bookValidation';
import { cacheMiddleware } from '../middleware/cache';

const router = Router();
const bookController = new BookController();

// Kitap arama route'u
router.get('/search', bookController.searchBooks);

// Cache'li route'lar
router.get('/', cacheMiddleware('book', 3600), bookController.getAllBooks);
router.get('/:id', cacheMiddleware('book', 3600), bookController.getBookById);

// Cache'siz route'lar
router.post('/', validateRequest(createBookSchema), bookController.createBook);

export default router; 