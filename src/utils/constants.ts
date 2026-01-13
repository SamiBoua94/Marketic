export const API_MESSAGES = {
    // Success
    SUCCESS: 'Operation successful',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',

    // Auth
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTER_SUCCESS: 'Registration successful',
    REGISTER_EMAIL_EXISTS: 'Email already in use',
    INVALID_CREDENTIALS: 'Invalid email or password',
    TOKEN_EXPIRED: 'Token expired',
    UNAUTHORIZED: 'Unauthorized',

    // Resources
    USER_NOT_FOUND: 'User not found',
    SHOP_NOT_FOUND: 'Shop not found',
    PRODUCT_NOT_FOUND: 'Product not found',

    // Validation
    VALIDATION_ERROR: 'Validation error',
    INVALID_INPUT: 'Invalid input',

    // Server
    INTERNAL_ERROR: 'Internal server error',
    SERVICE_UNAVAILABLE: 'Service unavailable',
};

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    MIN_LIMIT: 1,
};

export const FILE_UPLOAD = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    UPLOAD_DIR: './public/uploads',
};

export const JWT_CONFIG = {
    ALGORITHM: 'HS256',
    EXPIRATION: '7d',
};

export const PRODUCT_CATEGORIES = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Food & Beverage',
    'Toys & Games',
    'Beauty',
    'Other',
];

export const SHOP_LEGAL_STATUS = [
    'Individual',
    'EIRL',
    'SARL',
    'EURL',
    'SAS',
    'SASU',
    'SARL',
    'SCOP',
    'Micro-enterprise',
];
