// User Types
export interface IUser {
    id: string;
    email: string;
    password: string;
    name: string;
    profilePicture?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateUserDTO = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserDTO = Partial<Omit<IUser, 'id' | 'email' | 'password' | 'createdAt' | 'updatedAt'>>;

// Shop Types
export interface IShop {
    id: string;
    name: string;
    description?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    legalStatus?: string;
    email?: string;
    phone?: string;
    siret?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
    tags?: string[];
    profilePicture?: string;
    bannerPicture?: string;
    certificationPicture?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateShopDTO = Omit<IShop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type UpdateShopDTO = Partial<Omit<IShop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;

// Product Types
export interface IProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    images?: string[];
    tags?: string[];
    category?: string;
    productInfo?: Record<string, string>;
    options?: Record<string, string[]>;
    shopId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateProductDTO = Omit<IProduct, 'id' | 'shopId' | 'createdAt' | 'updatedAt'>;
export type UpdateProductDTO = Partial<Omit<IProduct, 'id' | 'shopId' | 'createdAt' | 'updatedAt'>>;

// Auth Types
export interface JWTPayload {
    id: string;
    email: string;
    name: string;
}

export interface AuthResponse {
    user: IUser;
    token: string;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    statusCode: number;
    timestamp: Date;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Filter Types
export interface FilterOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}
