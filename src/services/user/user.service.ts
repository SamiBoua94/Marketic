import { userRepository } from '@/repositories/user.repository';
import { UpdateUserDTO } from '@/types/entities.types';
import { NotFoundException } from '@/exceptions/http.exception';

export class UserService {
    async getUserById(id: string) {
        return userRepository.findByIdOrThrow(id);
    }

    async updateUser(id: string, data: UpdateUserDTO) {
        const user = await userRepository.findByIdOrThrow(id);
        return userRepository.update(id, data);
    }

    async getUserProfile(id: string) {
        return userRepository.findWithShop(id);
    }

    async getAllUsers(skip: number = 0, take: number = 20) {
        return userRepository.findAll(skip, take);
    }

    async deleteUser(id: string) {
        await userRepository.findByIdOrThrow(id);
        return userRepository.delete(id);
    }
}

export const userService = new UserService();
