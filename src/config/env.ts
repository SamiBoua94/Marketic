const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'GOOGLE_API_KEY',
];

export const env = {
    // Database
    DATABASE_URL: process.env.DATABASE_URL,

    // Authentication
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '7d',

    // API
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',

    // File Upload
    UPLOAD_DIR: process.env.UPLOAD_DIR || './public/uploads',
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),

    // CORS
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

    // Environment
    NODE_ENV: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
};

// Validate required env vars in production
if (env.isProd) {
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
}

export default env;
