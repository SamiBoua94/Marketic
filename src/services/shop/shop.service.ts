import { shopRepository } from '@/repositories/shop.repository';
import { CreateShopDTO, UpdateShopDTO } from '@/types/entities.types';
import { NotFoundException } from '@/exceptions/http.exception';

export class ShopService {
    async createShop(userId: string, data: CreateShopDTO) {
        return shopRepository.create({
            ...data,
            userId,
            tags: data.tags ? JSON.stringify(data.tags) : null,
        });
    }

    async getShopById(id: string) {
        return shopRepository.findByIdOrThrow(id);
    }

    async getShopByUserId(userId: string) {
        const shop = await shopRepository.findByUserId(userId);
        if (!shop) {
            throw new NotFoundException('Shop not found');
        }
        return shop;
    }

    async updateShop(id: string, data: UpdateShopDTO) {
        await shopRepository.findByIdOrThrow(id);
        return shopRepository.update(id, {
            ...data,
            tags: data.tags ? JSON.stringify(data.tags) : undefined,
        });
    }

    async getShopWithProducts(id: string) {
        return shopRepository.findWithProducts(id);
    }

    async searchShops(name: string, skip: number = 0, take: number = 20) {
        return shopRepository.searchByName(name, skip, take);
    }

    async deleteShop(id: string) {
        await shopRepository.findByIdOrThrow(id);
        return shopRepository.delete(id);
    }
}

export const shopService = new ShopService();
