import { userRepository } from '@/repositories/user.repository';
import { hashPassword, comparePassword } from '@/utils/helpers';
import { JWTPayload, CreateUserDTO } from '@/types/entities.types';
import { ConflictException, UnauthorizedException } from '@/exceptions/http.exception';

export class AuthService {
    async register(email: string, password: string, name: string) {
        // Check if email already exists
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        return userRepository.create({
            email,
            password: hashedPassword,
            name,
        });
    }

    async login(email: string, password: string) {
        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return user;
    }

    async validateToken(payload: JWTPayload) {
        const user = await userRepository.findById(payload.id);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }
}

export const authService = new AuthService();
