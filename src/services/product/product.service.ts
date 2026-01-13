import { productRepository } from '@/repositories/product.repository';
import { CreateProductDTO, UpdateProductDTO } from '@/types/entities.types';
import { NotFoundException } from '@/exceptions/http.exception';

export class ProductService {
    async createProduct(shopId: string, data: CreateProductDTO) {
        return productRepository.create({
            ...data,
            shopId,
            images: data.images ? JSON.stringify(data.images) : null,
            tags: data.tags ? JSON.stringify(data.tags) : null,
            productInfo: data.productInfo ? JSON.stringify(data.productInfo) : null,
            options: data.options ? JSON.stringify(data.options) : null,
        });
    }

    async getProductById(id: string) {
        return productRepository.findByIdOrThrow(id);
    }

    async getProductsByShopId(shopId: string, skip: number = 0, take: number = 20) {
        return productRepository.findByShopId(shopId, skip, take);
    }

    async updateProduct(id: string, data: UpdateProductDTO) {
        await productRepository.findByIdOrThrow(id);
        return productRepository.update(id, {
            ...data,
            images: data.images ? JSON.stringify(data.images) : undefined,
            tags: data.tags ? JSON.stringify(data.tags) : undefined,
            productInfo: data.productInfo ? JSON.stringify(data.productInfo) : undefined,
            options: data.options ? JSON.stringify(data.options) : undefined,
        });
    }

    async searchProducts(name: string, skip: number = 0, take: number = 20) {
        return productRepository.searchByName(name, skip, take);
    }

    async getProductsByCategory(category: string, skip: number = 0, take: number = 20) {
        return productRepository.findByCategory(category, skip, take);
    }

    async getInStockProducts(skip: number = 0, take: number = 20) {
        return productRepository.findInStock(skip, take);
    }

    async deleteProduct(id: string) {
        await productRepository.findByIdOrThrow(id);
        return productRepository.delete(id);
    }
}

export const productService = new ProductService();
