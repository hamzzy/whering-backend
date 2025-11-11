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
make start

# Run tests
make test
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

The API will be available at `http://localhost:3000/api/v1`
Swagger documentation: `http://localhost:3000/docs`

### Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build Docker image
docker build -t whering-test .
docker run -p 3000:3000 whering-test
```

## API Endpoints

All endpoints are prefixed with `/api` and versioned with `/v1/`:

- `GET /api/v1` - Get API information and address
- `POST /api/v1/items` - Create a clothing item
- `GET /api/v1/items` - List items (with filtering, pagination, sorting)
- `GET /api/v1/items/:id` - Get item details
- `PATCH /api/v1/items/:id` - Update an item
- `DELETE /api/v1/items/:id` - Delete an item
- `GET /api/v1/health` - Health check

**Note**: Swagger documentation is available at `/api/docs` (development only).

## Key Decisions & Assumptions

1. **In-memory storage**: Data is stored in-memory (no database) as per requirements. Easy to swap with a real database via repository pattern.

2. **Repository pattern**: Used interface-based repository abstraction for easy database migration later.

3. **Error handling**: Comprehensive try-catch in service layer with structured logging using Pino. Global exception filters for all error types.

4. **Swagger documentation**: Full API documentation available at `/docs` endpoint (disabled in production for security).

5. **Timestamps**: Added `createdAt` and `updatedAt` to items for better tracking.

6. **Validation**: Request validation using `class-validator` with DTOs. Whitelist mode enabled to reject unknown properties.

7. **Security**: Helmet, rate limiting, and CORS configured. Production-ready with environment-specific settings.

8. **Production features**: Graceful shutdown, correlation IDs, comprehensive error handling, and environment-aware configuration.

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
