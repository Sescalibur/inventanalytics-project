import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../models/User';
import { Book } from '../models/Book';
import { BookLoan } from '../models/BookLoan';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  dropSchema: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Book, BookLoan],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  }); 