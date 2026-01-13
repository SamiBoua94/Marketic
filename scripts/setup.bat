@echo off
REM Marketic Setup Script for Windows

color 0A
cls

echo ============================================================
echo            Marketic Setup Script (Windows)
echo ============================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ERROR: Node.js is not installed
    pause
    exit /b 1
)

node --version
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ERROR: Docker is not installed
    pause
    exit /b 1
)

docker --version
echo.

REM Copy .env.example to .env.local
if not exist .env.local (
    echo Creating .env.local from .env.example...
    copy .env.example .env.local
    echo.
    color 0C
    echo WARNING: Please update .env.local with your configuration
    color 0A
    echo.
) else (
    echo .env.local already exists
    echo.
)

REM Install dependencies
echo Installing dependencies...
call npm install
if errorlevel 1 (
    color 0C
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

REM Start PostgreSQL
echo Starting PostgreSQL with Docker...
docker-compose -f docker-compose.postgresql.yml up -d
if errorlevel 1 (
    color 0C
    echo ERROR: Failed to start PostgreSQL
    pause
    exit /b 1
)
echo PostgreSQL started. Waiting 10 seconds...
timeout /t 10 /nobreak
echo.

REM Run migrations
echo Running database migrations...
call npx prisma db push --skip-generate
if errorlevel 1 (
    color 0C
    echo ERROR: Failed to run migrations
    pause
    exit /b 1
)
echo.

REM Seed database
echo Seeding database...
call npx ts-node prisma/seeds/main.seed.ts
echo.

color 02
echo ============================================================
echo        Setup completed successfully!
echo ============================================================
echo.
echo Next steps:
echo 1. Update .env.local with your actual configuration
echo 2. Run: npm run dev
echo 3. Open: http://localhost:3000
echo.
echo Useful commands:
echo   npm run dev          - Start development server
echo   npm run db:studio    - Open Prisma Studio
echo   npm run db:seed      - Re-seed database
echo   docker-compose -f docker-compose.postgresql.yml down
echo.

pause
