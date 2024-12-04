# Library Management API

A RESTful API for a library management system where users can borrow books, return them, and provide ratings.

[English](#english) | [Türkçe](#turkish)

# English

## Features

- User management (list, create, detail view)
- Book management (list, create, detail view)
- Borrowing and returning books
- Book rating system
- Book search
- Redis cache system
- Rate limiting
- Validation and error handling

## Technologies

- Node.js & Express.js
- TypeScript
- PostgreSQL
- TypeORM
- Redis (optional)
- Joi (validation)
- Express Rate Limit
- Helmet (security)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create the PostgreSQL database:
```sql
CREATE DATABASE library_management;
```

3. Create the .env file:
```bash
env
PORT=3000
NODE_ENV=development

Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=library_management

Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
``` 

4. Start the application:
```bash
Development
npm run dev

Production
npm run build
npm start
```
## API Endpoints

### Users

```http
List all users
GET /api/users

User detail
GET /api/users/:id

Create a new user
POST /api/users
Content-Type: application/json
{
"name": "John Doe",
"email": "john@example.com"
}
```
### Books

```http
List all books
GET /api/books

Book detail
GET /api/books/:id

Search for a book
GET /api/books/search?query=robot

Create a new book
POST /api/books
Content-Type: application/json
{
"name": "1984"
}
```

### Borrowing/Returning

```http
Borrow a book
POST /api/users/:userId/borrow/:bookId

Return a book and rate
POST /api/users/:userId/return/:bookId
Content-Type: application/json
{
"score": 5
}
```

## Response Formats

### Successful Requests

```json
// GET /api/users
[
{
"id": 1,
"name": "John Doe"
}
]
// GET /api/users/:id
{
"id": 1,
"name": "John Doe",
"books": {
"past": [
{
"name": "1984",
"userScore": 5
}
],
"present": [
{
"name": "Brave New World"
}
]
}
}
```

### Error Responses

```json
son
{
"status": "error",
"message": "Hata mesajı açıklaması",
"code": 404
}

## Cache System (Redis)

The project uses Redis cache system for performance. It can work without Redis, but Redis is recommended for production environments.

### Redis Setup (Optional)

Using Docker:

```bash
docker run --name redis -p 6379:6379 -d redis
```

## Security Features

- Security headers with Helmet
- Rate limiting (15 minutes, 100 requests)
- Input validation (Joi)
- Detailed error handling
- CORS configuration

## Development
```bash
TypeScript compilation
npm run build

Development mode
npm run dev

Production mode
npm start
```

## Notes

- Book viewing operations are cached (1 hour)
- Rate limiting offers a higher limit for book viewing
- All inputs are validated
- Error messages are user-friendly and explanatory

## License

MIT

---

# Turkish

# Kütüphane Yönetim API'si

Bu proje, bir kütüphane yönetim sistemi için RESTful API sağlar. Kullanıcılar kitapları ödünç alabilir, iade edebilir ve puanlayabilir.

## Özellikler

- Kullanıcı yönetimi (listeleme, oluşturma, detay görüntüleme)
- Kitap yönetimi (listeleme, oluşturma, detay görüntüleme)
- Kitap ödünç alma ve iade etme
- Kitap puanlama sistemi
- Kitap arama
- Redis cache sistemi
- Rate limiting
- Validation ve error handling

## Teknolojiler

- Node.js & Express.js
- TypeScript
- PostgreSQL
- TypeORM
- Redis (opsiyonel)
- Joi (validation)
- Express Rate Limit
- Helmet (güvenlik)

## Kurulum

1. Gereksinimleri yükleyin:
```bash
npm install
```

2. PostgreSQL veritabanını oluşturun:
```sql
CREATE DATABASE library_management;
```

3. .env dosyasını oluşturun:
```bash
env
PORT=3000
NODE_ENV=development

Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=library_management

Redis (opsiyonel)
REDIS_HOST=localhost
REDIS_PORT=6379
``` 

4. Uygulamayı başlatın:
```bash
Development
npm run dev

Production
npm run build
npm start
```
## API Endpoints

### Kullanıcılar

```http
Tüm kullanıcıları listele
GET /api/users

Kullanıcı detayı
GET /api/users/:id

Yeni kullanıcı oluştur
POST /api/users
Content-Type: application/json
{
"name": "John Doe",
"email": "john@example.com"
}
```
### Kitaplar

```http
Tüm kitapları listele
GET /api/books

Kitap detayı
GET /api/books/:id

Kitap ara
GET /api/books/search?query=robot

Yeni kitap oluştur
POST /api/books
Content-Type: application/json
{
"name": "1984"
}
```

### Ödünç Alma/İade

```http
Kitap ödünç al
POST /api/users/:userId/borrow/:bookId

Kitap iade et ve puanla
POST /api/users/:userId/return/:bookId
Content-Type: application/json
{
"score": 5
}
```

## Response Formatları

### Başarılı İstekler

```json
// GET /api/users
[
{
"id": 1,
"name": "John Doe"
}
]
// GET /api/users/:id
{
"id": 1,
"name": "John Doe",
"books": {
"past": [
{
"name": "1984",
"userScore": 5
}
],
"present": [
{
"name": "Brave New World"
}
]
}
}
```

### Hata Yanıtları

```json
son
{
"status": "error",
"message": "Hata mesajı açıklaması",
"code": 404
}

## Cache Sistemi (Redis)

Proje, performansı artırmak için Redis cache sistemini kullanır. Redis olmadan da çalışabilir, ancak production ortamında Redis kullanılması önerilir.

### Redis Kurulumu (Opsiyonel)

Docker ile:

```bash
docker run --name redis -p 6379:6379 -d redis
```

## Güvenlik Özellikleri

- Helmet ile güvenlik başlıkları
- Rate limiting (15 dakikada 100 istek)
- Input validation (Joi)
- Detaylı hata yönetimi
- CORS yapılandırması

## Development
```bash
TypeScript derleme
npm run build

Development modunda çalıştırma
npm run dev

Production modunda çalıştırma
npm start
```

## Notlar

- Kitap görüntüleme işlemleri cache'lenir (1 saat)
- Rate limiting kitap görüntüleme için daha yüksek limit sunar
- Tüm input'lar validate edilir
- Hata mesajları kullanıcı dostu ve açıklayıcıdır

## License

MIT
