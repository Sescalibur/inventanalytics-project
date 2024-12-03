import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Book } from '../models/Book';
import { BookLoan } from '../models/BookLoan';
import { BookResponse } from '../types/responses';
import { IsNull } from 'typeorm';
import { ConflictError, NotFoundError, ValidationError } from '../utils/errors';
import { cacheMiddleware, clearCache } from '../middleware/cache';

export class BookController {
  private bookRepository = AppDataSource.getRepository(Book);
  private bookLoanRepository = AppDataSource.getRepository(BookLoan);

  // Cache'i temizle
  private async clearBookCache(bookId?: number) {
    if (bookId) {
      await clearCache(`book:*${bookId}`);
    }
    await clearCache('book:*');
  }

  // Tüm kitapları getir
  public getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const books = await this.bookRepository.find();
      const response = books.map(book => ({
        id: book.id,
        name: book.title
      }));
      res.json(response);
      return;
    } catch (error) {
      next(error);
    }
  };

  // Kitap detaylarını getir
  public getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const book = await this.bookRepository.findOne({
        where: { id: parseInt(req.params.id) },
        relations: ['bookLoans']
      });

      if (!book) {
        throw new NotFoundError('Book');
      }

      // Puanı hesapla
      const ratings = book.bookLoans
        .filter(loan => loan.rating !== null)
        .map(loan => loan.rating!);

      const response: BookResponse = {
        id: book.id,
        name: book.title,
        score: ratings.length > 0 
          ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2))
          : -1
      };

      res.json(response);
      return;
    } catch (error) {
      next(error);
    }
  };

  // Yeni kitap oluştur
  public createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name } = req.body;

      // Aynı isimde kitap var mı kontrol et
      const existingBook = await this.bookRepository.findOne({
        where: { title: name }
      });

      if (existingBook) {
        throw new ConflictError('A book with this name already exists');
      }

      const book = this.bookRepository.create({ 
        title: name,
        author: 'Unknown'
      });
      await this.bookRepository.save(book);
      await this.clearBookCache();
      res.status(201).send();
    } catch (error) {
      next(error);
    }
  };
} 