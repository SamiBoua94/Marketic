import { Prisma, PrismaClient } from '@prisma/client';
import { NotFoundException } from '@/exceptions/http.exception';

export abstract class BaseRepository<T> {
    constructor(protected model: any) {}

    async create(data: any): Promise<T> {
        return this.model.create({ data });
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findUnique({ where: { id } });
    }

    async findByIdOrThrow(id: string): Promise<T> {
        const record = await this.findById(id);
        if (!record) {
            throw new NotFoundException(`${this.model.name || 'Resource'} not found`);
        }
        return record;
    }

    async findAll(skip: number = 0, take: number = 20): Promise<[T[], number]> {
        const [data, count] = await Promise.all([
            this.model.findMany({ skip, take }),
            this.model.count(),
        ]);
        return [data, count];
    }

    async findMany(where: any): Promise<T[]> {
        return this.model.findMany({ where });
    }

    async update(id: string, data: any): Promise<T> {
        return this.model.update({ where: { id }, data });
    }

    async delete(id: string): Promise<T> {
        return this.model.delete({ where: { id } });
    }

    async count(where?: any): Promise<number> {
        return this.model.count({ where });
    }

    async exists(where: any): Promise<boolean> {
        const result = await this.model.findFirst({ where });
        return !!result;
    }
}
