#!/usr/bin/env node

import * as fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    // Ensure .env/.env.local exist (idempotent for fresh clone)
    const envLocalPath = path.join(__dirname, '..', '.env.local');
    const envPath = path.join(__dirname, '..', '.env');
    const envExamplePath = path.join(__dirname, '..', '.env.example');

    if (!fs.existsSync(envLocalPath) && fs.existsSync(envExamplePath)) {
        log(colors.blue, '📝 Creating .env.local from .env.example...');
        fs.copyFileSync(envExamplePath, envLocalPath);
        log(colors.green, '✅ .env.local created\n');
        log(colors.yellow, '⚠️  Please update .env.local with your actual configuration\n');
    } else if (!fs.existsSync(envLocalPath) && fs.existsSync(envPath)) {
        log(colors.blue, '📝 Creating .env.local from existing .env...');
        fs.copyFileSync(envPath, envLocalPath);
        log(colors.green, '✅ .env.local created from .env\n');
    } else if (!fs.existsSync(envLocalPath) && !fs.existsSync(envPath) && !fs.existsSync(envExamplePath)) {
        log(colors.blue, '📝 Creating default .env and .env.local...');
        const defaultEnv = `# Database Configuration\nDATABASE_URL=\"postgresql://marketic:secure_password@localhost:5432/marketic?schema=public\"\nDB_USER=marketic\nDB_PASSWORD=secure_password\nDB_NAME=marketic\nDB_PORT=5432\nDB_HOST=localhost\n\n# API Configuration\nAPI_URL=http://localhost:3000\nNEXTAUTH_SECRET=change-me\nNEXTAUTH_URL=http://localhost:3000\n`;
        fs.writeFileSync(envPath, defaultEnv);
        fs.writeFileSync(envLocalPath, defaultEnv);
        log(colors.green, '✅ Default .env and .env.local created\n');
        log(colors.yellow, '⚠️  Please review .env.local and update secrets before deploying to production\n');
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

        // Remove conflicting container if exists (idempotent start)
        try {
            const { stdout: existing } = await execAsync('docker ps -a --filter "name=marketic-postgres" --format "{{.ID}}"');
            if (existing && existing.trim()) {
                log(colors.yellow, `⚠️  Found existing container 'marketic-postgres' (id: ${existing.trim()}). Removing to avoid conflict...`);
                await execAsync(`docker rm -f marketic-postgres`);
                log(colors.green, `✅ Removed existing container 'marketic-postgres'`);
            }
        } catch (err) {
            // ignore — if docker is not installed we'll detect it below
        }

        if (await runCommand('docker-compose -f docker-compose.postgresql.yml up -d', 'Failed to start PostgreSQL')) {
            log(colors.green, '✅ PostgreSQL started\n');

            // Wait until PostgreSQL is ready using pg_isready inside the container
            log(colors.blue, '⏳ Waiting for PostgreSQL to be ready...');
            let ready = false;
            for (let i = 0; i < 30; i++) {
                try {
                    const { stdout } = await execAsync('docker exec marketic-postgres pg_isready -U marketic');
                    if (stdout && stdout.includes('accepting connections')) {
                        ready = true;
                        break;
                    }
                } catch (e) {
                    // ignore and retry
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            if (!ready) {
                log(colors.yellow, '⚠️  PostgreSQL did not become ready in time; continuing but DB commands may fail');
            } else {
                log(colors.green, '✅ PostgreSQL is ready');
            }

            log(colors.blue, '🔄 Running database setup...');
            if (await runCommand('npx prisma db push', 'Failed to push database schema')) {
                log(colors.green, '✅ Database schema synced\n');

                // Generate client
                await runCommand('npx prisma generate', 'Failed to generate Prisma client');

                log(colors.blue, '🌱 Seeding database with test data...');
                if (await runCommand('npx ts-node-esm prisma/seeds/main.seed.ts', 'Failed to seed database')) {
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
