#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Marketic Setup Script${NC}"
echo "========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker found: $(docker --version)${NC}"

# Copy .env.example to .env.local
if [ ! -f .env.local ]; then
    echo -e "${BLUE}📝 Creating .env.local from .env.example${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✅ .env.local created${NC}"
    echo -e "${RED}⚠️  Please update .env.local with your configuration${NC}"
else
    echo -e "${GREEN}✅ .env.local already exists${NC}"
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Start PostgreSQL
echo -e "${BLUE}🐘 Starting PostgreSQL with Docker...${NC}"
docker-compose -f docker-compose.postgresql.yml up -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PostgreSQL started${NC}"
    echo -e "${BLUE}⏳ Waiting for PostgreSQL to be ready...${NC}"
    sleep 10
else
    echo -e "${RED}❌ Failed to start PostgreSQL${NC}"
    exit 1
fi

# Run migrations
echo -e "${BLUE}🔄 Running database migrations...${NC}"
npx prisma db push --skip-generate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database migrations completed${NC}"
else
    echo -e "${RED}❌ Failed to run migrations${NC}"
    exit 1
fi

# Seed database
echo -e "${BLUE}🌱 Seeding database...${NC}"
npx ts-node prisma/seeds/main.seed.ts

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database seeded${NC}"
else
    echo -e "${RED}⚠️  Failed to seed database${NC}"
fi

echo ""
echo -e "${GREEN}✨ Setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📖 Next steps:${NC}"
echo "1. Update .env.local with your actual configuration"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo -e "${BLUE}📚 Useful commands:${NC}"
echo "  npm run dev          - Start development server"
echo "  npm run db:studio    - Open Prisma Studio"
echo "  npm run db:seed      - Re-seed database"
echo "  docker-compose -f docker-compose.postgresql.yml down  - Stop PostgreSQL"
