# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

## Installation (2 Commands)

### ⚡ Quick Start (Recommended)

```bash
# 1. Setup everything (dependencies, Docker, database)
npm run setup

# 2. Start development server
npm run dev
```

That's it! Your app will be running at http://localhost:3000

---

### Option 2: Manual Setup

1. **Clone and Install**
```bash
npm install
```

2. **Setup Environment**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. **Start PostgreSQL**
```bash
docker-compose -f docker-compose.postgresql.yml up -d
```

4. **Setup Database**
```bash
npx prisma db push
npx ts-node prisma/seeds/main.seed.ts
```

5. **Start Development Server**
```bash
npm run dev
```

## 🚀 Next Steps

1. **After setup is complete**, simply run:
   ```bash
   npm run dev
   ```

2. **Open your browser** to http://localhost:3000

3. **Optional - View Database** (pgAdmin):
   - URL: http://localhost:5050
   - Email: admin@marketic.local
   - Password: admin

4. **Optional - Prisma Studio** (Database GUI):
   ```bash
   npm run db:studio
   ```

## 📚 Project Structure

```
src/
├── app/              # Pages & Routes (Next.js)
├── services/         # Business Logic
├── repositories/     # Database Access
├── validators/       # Input Validation
├── types/           # TypeScript Interfaces
├── middleware/      # Request/Response Processing
├── exceptions/      # Error Handling
├── utils/           # Helper Functions
└── config/          # Configuration
```

## 💾 Database

### Useful Commands
```bash
npx prisma db push              # Sync schema with DB
npx prisma migrate dev          # Create new migration
npx prisma studio               # Open Prisma Studio (GUI)
npx ts-node prisma/seeds/main.seed.ts  # Seed database
```

### Test Accounts (after seeding)
- Email: `shop1@example.com`
- Password: `TestPassword123`

---

- Email: `admin@example.com`
- Password: `TestPassword123`

## 🔧 Environment Variables

Required variables in `.env.local`:
```env
DATABASE_URL="postgresql://marketic:secure_password@localhost:5432/marketic"
JWT_SECRET="your-secret-key"
GOOGLE_API_KEY="your-api-key"
NODE_ENV="development"
```

## 📖 Documentation

- Full Architecture: See [ARCHITECTURE.md](../ARCHITECTURE.md)
- API Examples: See [route.example.ts](../src/app/api/v1/auth/register/route.example.ts)
- Database Schema: See [schema.prisma](../prisma/schema.prisma)

## 🐛 Troubleshooting

### PostgreSQL Connection Error
```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.postgresql.yml ps

# Restart PostgreSQL
docker-compose -f docker-compose.postgresql.yml restart
```

### Database Migration Issues
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# View database state
npx prisma studio
```

### Port Already in Use
```bash
# Change port in docker-compose.postgresql.yml
# Or stop the service on that port
```

## 🚀 Next Steps

1. **Read [ARCHITECTURE.md](../ARCHITECTURE.md)** for detailed architecture information
2. **Create your first API endpoint** using the layered architecture
3. **Add validations** using Zod schemas
4. **Implement business logic** in services
5. **Add database models** to Prisma schema

## 📞 Support

For issues or questions:
1. Check [ARCHITECTURE.md](../ARCHITECTURE.md)
2. Review example code in `src/app/api/v1/auth/register/route.example.ts`
3. Look at test data in `prisma/seeds/main.seed.ts`

## 💡 Command Cheat Sheet

```bash
# Development
npm run dev                  # Start dev server
npm run build               # Build for production
npm start                   # Start production server

# Database
npm run setup:db            # Push schema + seed database
npm run db:push             # Sync schema with DB
npm run db:migrate          # Create new migration
npm run db:seed             # Run seeders
npm run db:studio           # Open Prisma Studio GUI
```
