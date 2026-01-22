# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Point of Sale (POS) backend system called "f2fpos-backend" built using Cloudflare Workers with Hono as the web framework. The application uses Drizzle ORM with Cloudflare D1 Database for data persistence and implements JWT-based authentication.

## Architecture

### Technology Stack
- **Framework**: Hono (Cloudflare Workers framework)
- **Database**: Cloudflare D1 (SQLite-compatible)
- **ORM**: Drizzle ORM
- **Authentication**: JWT tokens with refresh tokens
- **Environment**: Cloudflare Workers runtime with Node.js compatibility
- **Validation**: Zod for schema validation
- **Testing**: Vitest with Cloudflare Workers pool

### Project Structure
```
src/
├── db/                 # Database schema and migrations
│   └── schema/         # Drizzle schema definitions
├── global/             # Global types, models, and utility functions
│   ├── fn/            # Helper functions (encryption, token generation, etc.)
│   ├── models/        # Data models with business logic
│   └── types/         # Type definitions
├── middlewares/        # Authentication and CORS middleware
├── routes/             # API route definitions
│   ├── services/      # Business logic service routes
│   └── ...            # Main routes (auth, api, debug, user, post)
├── docs/               # Documentation files
└── scripts/            # Utility scripts
```

### Key Components
- **Authentication**: JWT-based with access and refresh tokens
- **Services**: Organized under `/routes/services/` for business logic (LoginService, OutletService, ProductCategoryService)
- **Models**: Located in `src/global/models/` for database interactions
- **Schema**: Defined in `src/db/schema/` using Drizzle ORM

### Environment Configuration
- **Wrangler**: Used for Cloudflare Workers deployment and local development
- **D1 Database**: Cloudflare's SQLite-compatible database
- **KV Storage**: For key-value storage needs
- **Environment Variables**: Defined in `wrangler.toml` and `.env.example`

## Development Commands

### Setup
```bash
# Install dependencies
pnpm install


```

### Development
```bash
# Start development server with Wrangler
pnpm dev

# Or with HTTPS (using local certificates)
pnpm dev:secure

# Run tests
pnpm test
```

### Database Operations
```bash
# Generate database migrations
pnpm db:generate

# Apply database migrations
pnpm db:up
```

### Deployment
```bash
# Deploy to Cloudflare Workers
pnpm deploy
```

## Key Patterns and Conventions

### Authentication Flow
- Login endpoints create JWT access and refresh tokens
- Access tokens expire after 5 minutes (configurable via TOKEN_EXPIRATION)
- Refresh tokens expire after 24 hours (configurable via REFRESH_TOKEN_EXPIRATION)
- Middleware validates JWT tokens for protected routes

### Data Access
- Models in `src/global/models/` provide database interaction methods
- Drizzle ORM is used for type-safe database queries
- Zod is used for request validation

### Route Organization
- `/auth` - Authentication endpoints (login, register, refresh, logout)
- `/api` - Main API routes
  - `/LoginService` - Login service endpoints
  - `/OutletService` - Outlet management
  - `/ProductCategoryService` - Product category management
  - `/users` - User management
  - `/posts` - Post management
- `/debug` - Debug endpoints

### Security Considerations
- JWT tokens are used for authentication
- Passwords are encrypted before storage
- CORS middleware is applied globally
- Input validation using Zod schemas

## Testing

Tests are configured using Vitest with the Cloudflare Workers pool. The test configuration is in `vitest.config.js`.

```bash
# Run all tests
pnpm test
```
