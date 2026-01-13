#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
};

function log(color, message) {
    console.log(`${color}${message}${colors.reset}`);
}

async function runCommand(command, errorMessage) {
    try {
        const { stdout } = await execAsync(command);
        return true;
    } catch (error) {
        log(colors.red, `❌ ${errorMessage}`);
        console.error(error.message);
        return false;
    }
}

async function main() {
    log(colors.blue, '\n🚀 Marketic Setup\n');

    // Check if .env.local exists
    const envLocalPath = path.join(__dirname, '..', '.env.local');
    if (!fs.existsSync(envLocalPath)) {
        log(colors.blue, '📝 Creating .env.local from .env.example...');
        const envExamplePath = path.join(__dirname, '..', '.env.example');
        if (fs.existsSync(envExamplePath)) {
            fs.copyFileSync(envExamplePath, envLocalPath);
            log(colors.green, '✅ .env.local created\n');
            log(colors.yellow, '⚠️  Please update .env.local with your actual configuration\n');
        }
    } else {
        log(colors.green, '✅ .env.local already exists\n');
    }

    // Install dependencies
    log(colors.blue, '📦 Installing dependencies...');
    if (!await runCommand('npm install', 'Failed to install dependencies')) {
        process.exit(1);
    }
    log(colors.green, '✅ Dependencies installed\n');

    // Check Docker
    log(colors.blue, '🐘 Checking Docker...');
    const dockerCheck = await runCommand('docker --version', 'Docker not found. Please install Docker Desktop.');
    if (!dockerCheck) {
        log(colors.yellow, '⚠️  Skipping Docker setup. Start PostgreSQL manually with:');
        log(colors.blue, '   docker-compose -f docker-compose.postgresql.yml up -d\n');
    } else {
        log(colors.green, '✅ Docker found\n');
        
        log(colors.blue, '🐘 Starting PostgreSQL...');
        if (await runCommand('docker-compose -f docker-compose.postgresql.yml up -d', 'Failed to start PostgreSQL')) {
            log(colors.green, '✅ PostgreSQL started\n');
            log(colors.blue, '⏳ Waiting for PostgreSQL to be ready (10 seconds)...');
            await new Promise(resolve => setTimeout(resolve, 10000));
            
            log(colors.blue, '🔄 Running database setup...');
            if (await runCommand('npx prisma db push --skip-generate', 'Failed to push database schema')) {
                log(colors.green, '✅ Database schema synced\n');
                
                log(colors.blue, '🌱 Seeding database with test data...');
                if (await runCommand('npx ts-node prisma/seeds/main.seed.ts', 'Failed to seed database')) {
                    log(colors.green, '✅ Database seeded\n');
                } else {
                    log(colors.yellow, '⚠️  Failed to seed database. You can run it manually with: npm run db:seed\n');
                }
            }
        }
    }

    log(colors.green, '═'.repeat(60));
    log(colors.green, '✨ Setup completed successfully!\n');
    log(colors.blue, '📖 Next steps:');
    log(colors.reset, '   1. Update .env.local with your configuration');
    log(colors.reset, '   2. Run: npm run dev\n');
    log(colors.blue, '📚 Useful commands:');
    log(colors.reset, '   npm run dev          - Start development server');
    log(colors.reset, '   npm run db:studio    - Open Prisma Studio');
    log(colors.reset, '   npm run db:seed      - Reseed database\n');
    log(colors.green, '═'.repeat(60) + '\n');
}

main().catch(error => {
    log(colors.red, `\n❌ Setup failed: ${error.message}\n`);
    process.exit(1);
});
