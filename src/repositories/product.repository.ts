import { prisma } from '@/lib/prisma';
import { BaseRepository } from './base.repository';
import { IProduct } from '@/types/entities.types';

export class ProductRepository extends BaseRepository<IProduct> {
    constructor() {
        super(prisma.product);
    }

    async findByShopId(shopId: string, skip: number = 0, take: number = 20): Promise<[IProduct[], number]> {
        const [data, count] = await Promise.all([
            this.model.findMany({
                where: { shopId },
                skip,
                take,
            }),
            this.model.count({ where: { shopId } }),
        ]);
        return [data, count];
    }

    async searchByName(name: string, skip: number = 0, take: number = 20): Promise<[IProduct[], number]> {
        const [data, count] = await Promise.all([
            this.model.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: 'insensitive',
                    },
                },
                skip,
                take,
            }),
            this.model.count({
                where: {
                    name: {
                        contains: name,
                        mode: 'insensitive',
                    },
                },
            }),
        ]);
        return [data, count];
    }

    async findByCategory(category: string, skip: number = 0, take: number = 20): Promise<[IProduct[], number]> {
        const [data, count] = await Promise.all([
            this.model.findMany({
                where: { category },
                skip,
                take,
            }),
            this.model.count({ where: { category } }),
        ]);
        return [data, count];
    }

    async findInStock(skip: number = 0, take: number = 20): Promise<[IProduct[], number]> {
        const [data, count] = await Promise.all([
            this.model.findMany({
                where: { stock: { gt: 0 } },
                skip,
                take,
            }),
            this.model.count({ where: { stock: { gt: 0 } } }),
        ]);
        return [data, count];
    }
}

export const productRepository = new ProductRepository();
