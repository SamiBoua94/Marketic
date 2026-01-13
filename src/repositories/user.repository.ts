import { prisma } from '@/lib/prisma';
import { BaseRepository } from './base.repository';
import { IUser } from '@/types/entities.types';

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(prisma.user);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return this.model.findUnique({ where: { email } });
    }

    async findByEmailOrThrow(email: string): Promise<IUser> {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async findWithShop(id: string): Promise<any> {
        return this.model.findUnique({
            where: { id },
            include: { shop: true },
        });
    }
}

export const userRepository = new UserRepository();
