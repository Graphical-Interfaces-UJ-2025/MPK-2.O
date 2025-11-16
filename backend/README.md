# Backend - Public Transport Management System

TypeScript Express backend built with clean architecture principles, dependency injection, and domain-driven design.

## Tech Stack

### Core Framework
- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web application framework
- **Node.js** - Runtime environment

### Database
- **Knex.js** - SQL query builder and migration tool
- **Objection.js** - ORM built on top of Knex
- **PostgreSQL** - Primary database (configurable)

### Authentication & Security
- **jsonwebtoken (JWT)** - Token-based authentication
- **bcrypt** - Password hashing
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

### Dependency Injection
- **tsyringe** - Lightweight dependency injection container
- **reflect-metadata** - Metadata reflection API for decorators

### API Documentation
- **swagger-jsdoc** - Generate Swagger/OpenAPI specification from JSDoc comments
- **swagger-ui-express** - Serve auto-generated Swagger UI

### Logging
- **winston** - Flexible logging library with multiple transports and context awareness

### Development Tools
- **tsx** - TypeScript execution and REPL for Node.js
- **ts-node** - TypeScript execution engine

## Architecture Overview

This backend follows **Clean Architecture** principles with clear separation of concerns across three main layers:

```
Domain Layer (Business Logic)
    ↑
Application Layer (Use Cases & Interfaces)
    ↑
Infrastructure Layer (External Concerns)
```

### Key Principles

1. **Dependency Rule**: Dependencies point inward (Infrastructure → Application → Domain)
2. **Interface Segregation**: Interfaces defined in Application layer, implemented in Infrastructure
3. **Dependency Injection**: All dependencies injected via constructor using TSyringe
4. **Repository Pattern**: Data access abstracted through repository interfaces
5. **Single Responsibility**: Each class/module has one reason to change

## Project Structure

```
backend/
├── src/
│   ├── modules/                      # Feature modules
│   │   └── shared/                   # Shared/common module
│   │       ├── domain/               # Domain Layer - Business Entities
│   │       │   ├── entities/         # Domain entities (business objects)
│   │       │   │   └── User.ts       # Example: User entity
│   │       │   └── mappers/          # Map between domain entities and persistence models
│   │       │       └── UserMapper.ts # Example: User mapper
│   │       │
│   │       ├── application/          # Application Layer - Business Rules
│   │       │   ├── dto/              # Data Transfer Objects
│   │       │   │   └── CreateUserDto.ts
│   │       │   ├── exceptions/       # Application-specific exceptions
│   │       │   ├── repositories/     # Repository interfaces (contracts)
│   │       │   │   └── IUserRepository.ts
│   │       │   ├── services/         # Service interfaces
│   │       │   │   ├── IAuthService.ts
│   │       │   │   └── ILogger.ts
│   │       │   └── use-cases/        # Application use cases (business workflows)
│   │       │       └── RegisterUserUseCase.ts
│   │       │
│   │       └── infrastructure/       # Infrastructure Layer - External Concerns
│   │           ├── controllers/      # HTTP controllers (handle requests/responses)
│   │           │   └── AuthController.ts
│   │           ├── database/         # Database-related code
│   │           │   ├── models/       # Objection.js models (persistence)
│   │           │   │   └── UserModel.ts
│   │           │   ├── migrations/   # Database migrations
│   │           │   │   └── 20250116_create_users_table.ts
│   │           │   └── seeds/        # Database seed files
│   │           ├── exceptions/       # Infrastructure-specific exceptions
│   │           ├── repositories/     # Repository implementations
│   │           │   └── UserRepository.ts
│   │           ├── routes/           # Express routes
│   │           │   ├── auth.routes.ts
│   │           │   └── index.ts
│   │           └── services/         # Service implementations
│   │               ├── AuthService.ts
│   │               └── WinstonLogger.ts
│   │
│   ├── config/                       # Configuration files
│   │   ├── database.ts               # Database configuration
│   │   └── swagger.ts                # Swagger/OpenAPI configuration
│   │
│   ├── container/                    # Dependency Injection container
│   │   └── index.ts                  # DI registrations
│   │
│   ├── app.ts                        # Express app setup
│   └── index.ts                      # Application entry point
│
├── logs/                             # Application logs (auto-generated)
│   ├── combined.log                  # All logs
│   ├── error.log                     # Error logs only
│   ├── exceptions.log                # Uncaught exceptions
│   └── rejections.log                # Unhandled promise rejections
│
├── .env.example                      # Example environment variables
├── knexfile.ts                       # Knex migration configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
└── README.md                         # This file
```

## Layer Responsibilities

### Domain Layer (`domain/`)
**Purpose**: Core business logic and entities

- **entities/**: Pure business objects with business rules
  - No framework dependencies
  - Contains domain logic and validation
  - Example: `User`, `Ticket`, `Route`

- **mappers/**: Convert between domain entities and persistence models
  - `toDomain()`: Database model → Domain entity
  - `toPersistence()`: Domain entity → Database model

**Rules**:
- No dependencies on other layers
- No framework code (Express, Knex, etc.)
- Pure TypeScript/JavaScript

### Application Layer (`application/`)
**Purpose**: Application business rules and use case orchestration

- **dto/**: Data Transfer Objects for moving data between layers
  - Input validation shapes
  - API request/response formats

- **repositories/**: Repository interface definitions
  - Define contracts for data access
  - No implementation details
  - Example: `IUserRepository`, `ITicketRepository`

- **services/**: Service interface definitions
  - Define contracts for business services
  - Example: `IAuthService`, `IPaymentService`

- **use-cases/**: Application-specific business workflows
  - Orchestrate domain entities and services
  - Implement business use cases
  - Example: `RegisterUserUseCase`, `PurchaseTicketUseCase`

- **exceptions/**: Application-specific exceptions

**Rules**:
- Can depend on Domain layer
- Cannot depend on Infrastructure layer
- Define interfaces, not implementations

### Infrastructure Layer (`infrastructure/`)
**Purpose**: External frameworks, tools, and implementation details

- **controllers/**: HTTP request handlers
  - Parse requests
  - Call use cases
  - Format responses
  - Contain Swagger documentation

- **repositories/**: Repository interface implementations
  - Implement interfaces from Application layer
  - Use Knex/Objection for database access
  - Handle data persistence

- **services/**: Service interface implementations
  - Implement interfaces from Application layer
  - Example: JWT signing, password hashing, email sending

- **database/**: Database-specific code
  - **models/**: Objection.js models (table representations)
  - **migrations/**: Database schema changes
  - **seeds/**: Test/demo data

- **routes/**: Express route definitions
  - Map HTTP endpoints to controllers

**Rules**:
- Can depend on Application and Domain layers
- Contains all framework-specific code
- Implements interfaces defined in Application layer

## Dependency Injection

The project uses **TSyringe** for dependency injection. All components are registered in `src/container/index.ts`.

### How It Works

1. **Define Interface** (Application layer):
```typescript
// src/modules/shared/application/repositories/IUserRepository.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
}

export const IUserRepositoryToken = Symbol('IUserRepository');
```

2. **Implement Interface** (Infrastructure layer):
```typescript
// src/modules/shared/infrastructure/repositories/UserRepository.ts
import { injectable } from 'tsyringe';

@injectable()
export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const model = await UserModel.query().findById(id);
    return model ? UserMapper.toDomain(model) : null;
  }

  async create(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const model = await UserModel.query().insert(data);
    return UserMapper.toDomain(model);
  }
}
```

3. **Register in Container**:
```typescript
// src/container/index.ts
container.register(IUserRepositoryToken, {
  useClass: UserRepository,
});
```

4. **Inject in Use Case**:
```typescript
// src/modules/shared/application/use-cases/RegisterUserUseCase.ts
@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject(IUserRepositoryToken) private userRepository: IUserRepository
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    // Use the repository
    return this.userRepository.create(user);
  }
}
```

## Logging

The application uses a context-aware singleton logger built on **Winston** that shows exactly which service or use case is generating each log entry.

### Features

- **Singleton Pattern**: One logger instance shared across the entire application
- **Context Awareness**: Each service/use case creates a child logger with its name
- **Multiple Transports**: Console output + file logging (separate files for errors, combined logs, exceptions, and rejections)
- **Log Levels**: error, warn, info, debug
- **Automatic Formatting**: Timestamps, log levels, context labels, and metadata
- **Development-Friendly**: Colorized output in development mode

### Log Format

```
2025-01-16 10:30:45 [INFO] [AuthService] Generating JWT token for user {"userId":"123e4567-e89b-12d3-a456-426614174000"}
2025-01-16 10:30:46 [WARN] [RegisterUserUseCase] Registration failed: User already exists {"email":"user@example.com"}
```

### Using the Logger

**1. Inject the logger in your service/use case:**

```typescript
import { inject, injectable } from 'tsyringe';
import { ILogger, ILoggerToken } from '../../application/services/ILogger';

@injectable()
export class YourService {
  private readonly logger: ILogger;

  constructor(@inject(ILoggerToken) logger: ILogger) {
    // Create a child logger with your service name as context
    this.logger = logger.child('YourService');
  }

  async doSomething(userId: string): Promise<void> {
    this.logger.info('Doing something for user', { userId });

    try {
      // ... your logic
      this.logger.debug('Operation completed successfully');
    } catch (error) {
      this.logger.error('Operation failed', error instanceof Error ? error : undefined);
      throw error;
    }
  }
}
```

**2. Available log methods:**

```typescript
// Informational messages
logger.info('User logged in successfully', { userId: '123' });

// Warnings
logger.warn('Invalid token provided', { token: 'abc...' });

// Errors (with Error object for stack traces)
logger.error('Database connection failed', new Error('Connection timeout'));

// Debug information (only shown when LOG_LEVEL=debug)
logger.debug('Processing request', { requestId: '456' });
```

### Log Files

Logs are stored in the `backend/logs/` directory:

- `combined.log` - All log levels
- `error.log` - Only errors
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

Each file has automatic rotation (max 5 files, 5MB each).

### Configuration

Set the log level in your `.env` file:

```env
LOG_LEVEL=info  # Options: error, warn, info, debug
```

- **production**: Use `error` or `warn` to reduce log volume
- **development**: Use `info` or `debug` for detailed logging

### Best Practices

1. **Always use child loggers** with meaningful context names:
   ```typescript
   this.logger = logger.child('AuthService');
   this.logger = logger.child('RegisterUserUseCase');
   ```

2. **Include relevant metadata** in logs:
   ```typescript
   logger.info('User created', { userId, email });
   ```

3. **Use appropriate log levels**:
   - `error`: Application errors, exceptions
   - `warn`: Unexpected but handled situations
   - `info`: Important business operations (user login, registration, etc.)
   - `debug`: Detailed technical information for debugging

4. **Log sensitive data carefully**:
   ```typescript
   // ❌ Don't log passwords, tokens, etc.
   logger.info('User logging in', { email, password }); // BAD

   // ✅ Log only non-sensitive identifiers
   logger.info('User logging in', { email }); // GOOD
   ```

## Setup Instructions

### 1. Prerequisites

- Node.js v18 or higher
- PostgreSQL database (or another SQL database)
- npm

### 2. Install Dependencies

From the backend directory:
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=3000

# Database Configuration
DB_CLIENT=pg                    # Database client (pg, mysql, sqlite3)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=transport_system
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### 4. Database Setup

Run migrations to create database tables:
```bash
npm run migrate:latest
```

(Optional) Seed the database with sample data:
```bash
npm run seed:run
```

### 5. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

### 6. Verify Setup

- **Health Check**: http://localhost:3000/health
- **API Documentation**: http://localhost:3000/api-docs

## Available Scripts

### Development
- `npm run dev` - Start development server with hot reload (using tsx)

### Build & Production
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server (requires build first)

### Database Migrations
- `npm run migrate:latest` - Run all pending migrations
- `npm run migrate:rollback` - Rollback the last batch of migrations
- `npm run migrate:make <name>` - Create a new migration file

### Database Seeds
- `npm run seed:run` - Run all seed files
- `npm run seed:make <name>` - Create a new seed file

### Testing
- `npm test` - Run tests (not yet configured)

## Database Migrations

Migrations are located in `src/modules/shared/infrastructure/database/migrations/`

### Create a New Migration

```bash
npm run migrate:make create_tickets_table
```

This creates a new migration file with `up` and `down` functions:

```typescript
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tickets', (table) => {
    table.uuid('id').primary();
    table.string('ticket_number').notNullable().unique();
    // ... more columns
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tickets');
}
```

### Run Migrations

```bash
npm run migrate:latest
```

### Rollback Migrations

```bash
npm run migrate:rollback
```

## API Documentation (Swagger)

Swagger documentation is automatically generated from JSDoc comments in controllers.

### Access Swagger UI
http://localhost:3000/api-docs

### Document an Endpoint

Add JSDoc comments above controller methods:

```typescript
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Bad request
 */
async register(req: Request, res: Response): Promise<void> {
  // Implementation
}
```

## Adding a New Module

To add a new feature module (e.g., `tickets`):

### 1. Create Module Structure

```bash
mkdir -p src/modules/tickets/{domain/{entities,mappers},application/{dto,repositories,services,use-cases},infrastructure/{controllers,repositories,services,database/models,routes}}
```

### 2. Create Domain Entity

```typescript
// src/modules/tickets/domain/entities/Ticket.ts
export class Ticket {
  constructor(
    public readonly id: string,
    public readonly ticketNumber: string,
    public readonly userId: string,
    public readonly price: number,
    public readonly validUntil: Date
  ) {}
}
```

### 3. Create Repository Interface

```typescript
// src/modules/tickets/application/repositories/ITicketRepository.ts
export interface ITicketRepository {
  findById(id: string): Promise<Ticket | null>;
  create(ticket: Ticket): Promise<Ticket>;
}

export const ITicketRepositoryToken = Symbol('ITicketRepository');
```

### 4. Create Repository Implementation

```typescript
// src/modules/tickets/infrastructure/repositories/TicketRepository.ts
@injectable()
export class TicketRepository implements ITicketRepository {
  async findById(id: string): Promise<Ticket | null> {
    // Implementation using Objection
  }
}
```

### 5. Register in DI Container

```typescript
// src/container/index.ts
import { ITicketRepositoryToken } from '../modules/tickets/application/repositories/ITicketRepository';
import { TicketRepository } from '../modules/tickets/infrastructure/repositories/TicketRepository';

container.register(ITicketRepositoryToken, {
  useClass: TicketRepository,
});
```

### 6. Create Use Case

```typescript
// src/modules/tickets/application/use-cases/PurchaseTicketUseCase.ts
@injectable()
export class PurchaseTicketUseCase {
  constructor(
    @inject(ITicketRepositoryToken) private ticketRepository: ITicketRepository
  ) {}

  async execute(dto: PurchaseTicketDto): Promise<Ticket> {
    // Business logic
  }
}
```

### 7. Create Controller & Routes

```typescript
// src/modules/tickets/infrastructure/controllers/TicketController.ts
@injectable()
export class TicketController {
  constructor(private purchaseTicketUseCase: PurchaseTicketUseCase) {}

  async purchase(req: Request, res: Response): Promise<void> {
    // Handle HTTP request
  }
}

// src/modules/tickets/infrastructure/routes/ticket.routes.ts
const router = Router();
const ticketController = container.resolve(TicketController);

router.post('/purchase', (req, res) => ticketController.purchase(req, res));

export { router as ticketRoutes };
```

### 8. Add to Main Router

```typescript
// src/modules/shared/infrastructure/routes/index.ts
import { ticketRoutes } from '../../../tickets/infrastructure/routes/ticket.routes';

router.use('/tickets', ticketRoutes);
```

## Best Practices

### 1. Repository Pattern
- All database operations go through repositories
- Repositories return domain entities, not database models
- Use mappers to convert between models and entities

### 2. Use Cases
- One use case per business operation
- Use cases orchestrate the business flow
- Keep use cases focused and single-purpose

### 3. Dependency Injection
- Always inject through interfaces, never concrete classes
- Define interfaces in Application layer
- Implement in Infrastructure layer

### 4. Error Handling
- Create custom exceptions in Application layer
- Handle errors in controllers
- Return appropriate HTTP status codes

### 5. DTOs
- Use DTOs for data coming from external sources
- Validate DTOs at the controller level
- Keep DTOs simple (no business logic)

### 6. Testing
- Test use cases with mocked repositories
- Test repositories with a test database
- Test controllers with integration tests

## Common Issues & Solutions

### Issue: "Cannot find module" errors
**Solution**: Make sure you've run `npm install` and TypeScript compilation succeeds

### Issue: Database connection errors
**Solution**:
- Check your `.env` configuration
- Ensure PostgreSQL is running
- Verify database credentials

### Issue: Migration errors
**Solution**:
- Check migration file syntax
- Ensure database user has proper permissions
- Review `knexfile.ts` configuration

### Issue: Dependency injection not working
**Solution**:
- Ensure `reflect-metadata` is imported in `app.ts`
- Check that decorators are properly applied (`@injectable()`, `@inject()`)
- Verify registration in `src/container/index.ts`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user (to be implemented)

### Health
- `GET /health` - Health check endpoint

## Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment (development/production) | development | No |
| `PORT` | Server port | 3000 | No |
| `LOG_LEVEL` | Logging level (error, warn, info, debug) | info | No |
| `DB_CLIENT` | Database client (pg, mysql, sqlite3) | pg | Yes |
| `DB_HOST` | Database host | localhost | Yes |
| `DB_PORT` | Database port | 5432 | Yes |
| `DB_NAME` | Database name | transport_system | Yes |
| `DB_USER` | Database user | postgres | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d | No |

## Contributing

When contributing to the backend:

1. Follow the clean architecture structure
2. Create interfaces in Application layer
3. Implement in Infrastructure layer
4. Register dependencies in DI container
5. Add Swagger documentation to new endpoints
6. Create migrations for database changes
7. Write tests for new features

## License

ISC
