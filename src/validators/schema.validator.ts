import { z } from 'zod';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// User Validators
export const createUserSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .regex(emailRegex, 'Invalid email format'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
});

export const updateUserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    profilePicture: z.string().url('Invalid URL').optional(),
    description: z.string().max(500, 'Description must not exceed 500 characters').optional(),
});

export const loginSchema = z.object({
    email: z.string().regex(emailRegex, 'Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

// Shop Validators
export const createShopSchema = z.object({
    name: z
        .string()
        .min(2, 'Shop name must be at least 2 characters')
        .max(100, 'Shop name must not exceed 100 characters'),
    description: z.string().max(1000, 'Description must not exceed 1000 characters').optional(),
    email: z.string().regex(emailRegex, 'Invalid email format').optional(),
    phone: z.string().regex(/^\+?[0-9\s-]{10,}$/, 'Invalid phone number').optional(),
    address: z.string().max(200, 'Address must not exceed 200 characters').optional(),
    city: z.string().max(100, 'City must not exceed 100 characters').optional(),
    postalCode: z.string().regex(/^[0-9]{5}$/, 'Invalid postal code').optional(),
    siret: z.string().regex(/^[0-9]{14}$/, 'SIRET must be 14 digits').optional(),
    tags: z.array(z.string()).optional(),
});

export const updateShopSchema = createShopSchema.partial();

// Product Validators
export const createProductSchema = z.object({
    name: z
        .string()
        .min(2, 'Product name must be at least 2 characters')
        .max(200, 'Product name must not exceed 200 characters'),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description must not exceed 2000 characters'),
    price: z.number().positive('Price must be greater than 0'),
    stock: z.number().int().min(0, 'Stock must be a non-negative integer'),
    category: z.string().max(100, 'Category must not exceed 100 characters').optional(),
    images: z.array(z.string().url('Invalid image URL')).optional(),
    tags: z.array(z.string()).optional(),
    productInfo: z.record(z.string()).optional(),
    options: z.record(z.array(z.string())).optional(),
});

export const updateProductSchema = createProductSchema.partial();

// Helper function to validate
export async function validate<T>(schema: z.ZodSchema, data: unknown): Promise<T> {
    return schema.parseAsync(data);
}

export type ValidateError = {
    field: string;
    message: string;
};

export function formatValidationErrors(error: z.ZodError): ValidateError[] {
    return error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
    }));
}
