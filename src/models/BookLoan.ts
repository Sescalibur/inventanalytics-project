import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Book } from './Book';

@Entity('book_loans')
export class BookLoan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookLoans)
  user: User;

  @ManyToOne(() => Book, (book) => book.bookLoans)
  book: Book;

  @CreateDateColumn()
  borrowedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  returnedAt: Date;

  @Column({ type: 'int', nullable: true })
  rating: number | null;
} 