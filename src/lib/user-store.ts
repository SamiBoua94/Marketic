// Simple in-memory store for demo (will be replaced by Prisma when DB is set up)
interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    profilePicture: string | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const users: Map<string, User> = new Map();

export const userStore = {
    findByEmail: (email: string): User | undefined => {
        return Array.from(users.values()).find(u => u.email === email);
    },

    findById: (id: string): User | undefined => {
        return users.get(id);
    },

    create: (data: { email: string; password: string; name: string }): User => {
        const id = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const now = new Date();
        const user: User = {
            id,
            email: data.email,
            password: data.password,
            name: data.name,
            profilePicture: null,
            description: null,
            createdAt: now,
            updatedAt: now,
        };
        users.set(id, user);
        return user;
    },

    update: (id: string, data: Partial<User>): User | undefined => {
        const user = users.get(id);
        if (!user) return undefined;
        const updated = { ...user, ...data, updatedAt: new Date() };
        users.set(id, updated);
        return updated;
    },
};
