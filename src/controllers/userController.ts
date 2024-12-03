import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Book } from '../models/Book';
import { BookLoan } from '../models/BookLoan';
import { UserResponse } from '../types/responses';
import { IsNull } from 'typeorm';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);
  private bookRepository = AppDataSource.getRepository(Book);
  private bookLoanRepository = AppDataSource.getRepository(BookLoan);

  // Tüm kullanıcıları getir
  public getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userRepository.find();
      const response = users.map(user => ({
        id: user.id,
        name: user.name
      }));
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  // Kullanıcı detaylarını getir
  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userRepository.findOne({
        where: { id: parseInt(req.params.id) },
        relations: ['bookLoans', 'bookLoans.book']
      });

      if (!user) {
        throw new NotFoundError('User');
      }

      const response: UserResponse = {
        id: user.id,
        name: user.name,
        books: {
          past: user.bookLoans
            .filter(loan => loan.returnedAt !== null)
            .map(loan => ({
              name: loan.book.title,
              userScore: loan.rating || 0
            })),
          present: user.bookLoans
            .filter(loan => loan.returnedAt === null)
            .map(loan => ({
              name: loan.book.title
            }))
        }
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  // Yeni kullanıcı oluştur
  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email } = req.body;
      const user = this.userRepository.create({ name, email });
      await this.userRepository.save(user);
      res.status(201).json({ id: user.id, name: user.name });
    } catch (error) {
      next(error);
    }
  };

  // Kitap ödünç al
  public borrowBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const bookId = parseInt(req.params.bookId);

      const user = await this.userRepository.findOne({ where: { id: userId } });
      const book = await this.bookRepository.findOne({ where: { id: bookId } });

      if (!user || !book) {
        throw new NotFoundError((!user ? 'User' : 'Book'));
      }

      // Kitap zaten ödünç alınmış mı kontrol et
      const existingLoan = await this.bookLoanRepository.findOne({
        where: { book: { id: bookId }, returnedAt: IsNull() }
      });

      if (existingLoan) {
        throw new ConflictError('Book is already borrowed');
      }

      const bookLoan = this.bookLoanRepository.create({
        user: { id: userId },
        book: { id: bookId },
        borrowedAt: new Date()
      } as Partial<BookLoan>);

      await this.bookLoanRepository.save(bookLoan);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  // Kitap iade et
  public returnBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const bookId = parseInt(req.params.bookId);
      const { score } = req.body;

      const bookLoan = await this.bookLoanRepository.findOne({
        where: {
          user: { id: userId },
          book: { id: bookId },
          returnedAt: IsNull()
        }
      });

      if (!bookLoan) {
        return next(new Error('Active loan not found'));
      }

      bookLoan.returnedAt = new Date();
      bookLoan.rating = score;
      await this.bookLoanRepository.save(bookLoan);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
} 