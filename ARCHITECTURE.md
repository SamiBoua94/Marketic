# Marketic - Architecture Documentation

## 📁 Project Structure

### Layer Architecture

```
src/
├── app/                      # Next.js App Router (Pages & Routes)
├── api/                      # API Routes
├── services/                 # Business Logic Layer
├── repositories/             # Data Access Layer
├── middleware/               # Request/Response Middleware
├── validators/               # Input Validation Schemas
├── exceptions/               # Custom Error Handling
├── types/                    # TypeScript Types & Interfaces
├── utils/                    # Utility Functions & Helpers
├── config/                   # Application Configuration
├── components/               # React Components
├── hooks/                    # Custom React Hooks
├── context/                  # React Context API
└── lib/                      # External Libraries Integration
```

## 🔄 Data Flow

```
Request
  ↓
API Route
  ↓
Validation (Schema Validator)
  ↓
Service (Business Logic)
  ↓
Repository (Database Access)
  ↓
Prisma Client (PostgreSQL)
  ↓
Response
```

## 📦 Core Concepts

### 1. Services (`src/services/`)
- **Purpose**: Contains business logic and rules
- **Example**: `UserService`, `ProductService`, `ShopService`
- **Responsibility**:
  - Validate business requirements
  - Coordinate between repositories
  - Handle complex logic
  - Throw custom exceptions

### 2. Repositories (`src/repositories/`)
- **Purpose**: Data Access Layer (DAL)
- **Example**: `UserRepository`, `ProductRepository`
- **Responsibility**:
  - CRUD operations
  - Database queries
  - Abstract Prisma from services
  - Handle database-specific logic

### 3. Validators (`src/validators/`)
- **Purpose**: Input validation using Zod schemas
- **Example**: `createUserSchema`, `updateProductSchema`
- **Usage**: Validate request data before processing

### 4. Exceptions (`src/exceptions/`)
- **Purpose**: Structured error handling
- **Types**: 
  - `HttpException` (base)
  - `BadRequestException` (400)
  - `UnauthorizedException` (401)
  - `ForbiddenException` (403)
  - `NotFoundException` (404)
  - `ConflictException` (409)

### 5. Middleware (`src/middleware/`)
- **Purpose**: Request/Response processing
- **Files**:
  - `auth.middleware.ts`: Token verification
  - `error.handler.ts`: Unified error handling
  - `validation.middleware.ts`: Input validation

### 6. Types (`src/types/`)
- **Purpose**: Shared TypeScript interfaces
- **Contains**:
  - Entity interfaces (IUser, IProduct, IShop)
  - DTO types (CreateUserDTO, UpdateUserDTO)
  - API response types
  - Filter and pagination types

## 🚀 Development Workflow

### Creating a New Feature

#### 1. Define Types
```typescript
// src/types/entities.types.ts
export interface INewEntity {
  id: string;
  name: string;
  // ...
}

export type CreateNewEntityDTO = Omit<INewEntity, 'id' | 'createdAt' | 'updatedAt'>;
```

#### 2. Create Repository
```typescript
// src/repositories/new-entity.repository.ts
export class NewEntityRepository extends BaseRepository<INewEntity> {
  async customQuery() {
    // Implement custom queries
  }
}
```

#### 3. Create Service
```typescript
// src/services/new-entity/new-entity.service.ts
export class NewEntityService {
  constructor(private repository: NewEntityRepository) {}
  
  async createEntity(data: CreateNewEntityDTO) {
    // Business logic
    return this.repository.create(data);
  }
}
```

#### 4. Create Validator
```typescript
// src/validators/schema.validator.ts
export const createNewEntitySchema = z.object({
  name: z.string().min(1),
  // ...
});
```

#### 5. Create API Route
```typescript
// src/app/api/v1/entities/route.ts
import { validate } from '@/validators/schema.validator';
import { successResponse, handleError } from '@/middleware/error.handler';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const validated = await validate(createNewEntitySchema, data);
    const result = await newEntityService.createEntity(validated);
    return successResponse(result, 201);
  } catch (error) {
    return handleError(error);
  }
}
```

## 🗄️ Database

### PostgreSQL Setup

#### Using Docker Compose:
```bash
docker-compose -f docker-compose.postgresql.yml up -d
```

#### Environment Variables:
```env
DATABASE_URL="postgresql://marketic:secure_password@localhost:5432/marketic"
JWT_SECRET="your-secret-key"
GOOGLE_API_KEY="your-api-key"
```

### Database Migrations:
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Seed database
npx ts-node prisma/seeds/main.seed.ts
```

## 📋 API Versioning

Routes follow semantic versioning: `/api/v1/resource`

### Current Endpoints:
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/users/:id` - Get user
- `GET /api/v1/shops/:id` - Get shop
- `GET /api/v1/products/:id` - Get product

## 🧪 Testing

### Unit Tests
- Test services in isolation
- Mock repositories

### Integration Tests
- Test API routes end-to-end
- Use test database

## 🔐 Security Best Practices

1. **Authentication**: JWT tokens with expiration
2. **Validation**: Always validate input with Zod
3. **Authorization**: Check user permissions in services
4. **Environment Variables**: Never commit secrets
5. **Error Handling**: Don't expose sensitive info in errors
6. **Password**: Hash with bcrypt

## 📚 Useful Commands

```bash
# Development
npm run dev

# Build
npm run build

# Database
npx prisma studio                    # Open Prisma Studio
npx prisma db push                   # Sync schema with DB
npx ts-node prisma/seeds/main.seed.ts  # Seed database

# Linting
npm run lint
```

## 📖 Related Files

- Configuration: [env.ts](src/config/env.ts)
- Types: [entities.types.ts](src/types/entities.types.ts)
- Validators: [schema.validator.ts](src/validators/schema.validator.ts)
- Error Handling: [http.exception.ts](src/exceptions/http.exception.ts)
- Base Repository: [base.repository.ts](src/repositories/base.repository.ts)
