import { prisma } from '@/lib/prisma';
import { BaseRepository } from './base.repository';
import { IShop } from '@/types/entities.types';

export class ShopRepository extends BaseRepository<IShop> {
    constructor() {
        super(prisma.shop);
    }

    async findByUserId(userId: string): Promise<IShop | null> {
        return this.model.findUnique({ where: { userId } });
    }

    async findWithProducts(id: string): Promise<any> {
        return this.model.findUnique({
            where: { id },
            include: { products: true },
        });
    }

    async searchByName(name: string, skip: number = 0, take: number = 20): Promise<[IShop[], number]> {
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
}

export const shopRepository = new ShopRepository();
