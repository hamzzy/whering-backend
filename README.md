# Digital Wardrobe API

A NestJS-based REST API for managing clothing items in a digital wardrobe platform.

## How to Run

### Prerequisites
- Node.js 20+
- npm

### Quick Start (Makefile)

```bash
# Install dependencies
make install

# Run in development mode
make dev

# Run tests
make test

# Build application
make build

# Docker commands
make docker-build  # Build Docker image
make docker-up     # Start with docker-compose
```

### Manual Commands

```bash
# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Run tests
npm test

# Run e2e tests
npm run test:e2e
```

The API will be available at `http://localhost:3000`
Swagger documentation: `http://localhost:3000/api`

### Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build Docker image
docker build -t whering-test .
docker run -p 3000:3000 whering-test
```

## API Endpoints

- `POST /items` - Create a clothing item
- `GET /items` - List items (with filtering, pagination, sorting)
- `GET /items/:id` - Get item details
- `PATCH /items/:id` - Update an item
- `DELETE /items/:id` - Delete an item
- `GET /health` - Health check

## Key Decisions & Assumptions

1. **In-memory storage**: Data is stored in-memory (no database) as per requirements. Easy to swap with a real database via repository pattern.

2. **Repository pattern**: Used interface-based repository abstraction for easy database migration later.

3. **Error handling**: Comprehensive try-catch in service layer with structured logging using Pino.

4. **Swagger documentation**: Full API documentation available at `/api` endpoint.

5. **Timestamps**: Added `createdAt` and `updatedAt` to items for better tracking.

6. **Validation**: Request validation using `class-validator` with DTOs.

7. **Security**: Helmet, rate limiting, and CORS configured.

## Tech Stack

- NestJS 10
- TypeScript
- Pino (structured logging)
- Swagger/OpenAPI
- Jest (testing)
- Docker

## Project Structure

```
src/
├── modules/items/     # Items feature module
│   ├── controllers/   # HTTP layer
│   ├── services/      # Business logic
│   ├── repositories/  # Data access (interface + in-memory)
│   ├── dtos/          # Data transfer objects
│   └── entities/      # Domain models
├── common/            # Shared utilities
│   ├── exceptions/    # Custom exceptions
│   └── filters/       # Exception filters
└── config/           # Configuration
```
