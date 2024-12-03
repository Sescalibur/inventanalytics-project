import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateRequest } from '../middleware/validateRequest';
import { createUserSchema } from '../validations/userValidation';
import { returnBookSchema } from '../validations/bookValidation';

const router = Router();
const userController = new UserController();

// GET /api/users - Tüm kullanıcıları listele
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Belirli bir kullanıcının detaylarını getir
router.get('/:id', userController.getUserById);

// POST /api/users - Yeni kullanıcı oluştur
router.post('/', validateRequest(createUserSchema), userController.createUser);

// POST /users/:userId/borrow/:bookId - Kitap ödünç al
router.post('/:userId/borrow/:bookId', userController.borrowBook);

// POST /users/:userId/return/:bookId - Kitap iade
router.post('/:userId/return/:bookId', validateRequest(returnBookSchema), userController.returnBook);

export default router; 