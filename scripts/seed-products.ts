
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Get or create a User
    let user = await prisma.user.findFirst({
        where: { email: 'demo@markethic.com' },
    });

    if (!user) {
        console.log('Creating demo user...');
        user = await prisma.user.create({
            data: {
                email: 'demo@markethic.com',
                password: 'password123', // In a real app, hash this!
                name: 'Demo User',
            },
        });
    }

    // 2. Get or create a Shop
    let shop = await prisma.shop.findUnique({
        where: { userId: user.id },
    });

    if (!shop) {
        console.log('Creating demo shop...');
        shop = await prisma.shop.create({
            data: {
                name: 'Eco Shop',
                description: 'A sustainable shop for testing',
                userId: user.id,
            },
        });
    }

    // 3. Create Products
    const products = [
        {
            name: 'Savon Artisanal Lavande',
            description: 'Savon fait main aux huiles essentielles de lavande bio.',
            price: 8.50,
            stock: 50,
            images: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=800&auto=format&fit=crop&q=60',
            category: 'Hygiène',
        },
        {
            name: 'Brosse à dents en bambou',
            description: 'Alternative écologique aux brosses en plastique.',
            price: 4.00,
            stock: 100,
            images: 'https://images.unsplash.com/photo-1607613009820-a29f7bb6dcaf?w=800&auto=format&fit=crop&q=60',
            category: 'Hygiène',
        },
        {
            name: 'Gourde Inox 500ml',
            description: 'Gourde isotherme réutilisable pour réduire les déchets.',
            price: 25.00,
            stock: 30,
            images: 'https://images.unsplash.com/photo-1602143407151-01114192003f?w=800&auto=format&fit=crop&q=60',
            category: 'Accessoires',
        },
    ];

    for (const p of products) {
        const existing = await prisma.product.findFirst({
            where: { name: p.name, shopId: shop.id },
        });

        if (!existing) {
            console.log(`Creating product: ${p.name}`);
            await prisma.product.create({
                data: {
                    ...p,
                    shopId: shop.id,
                },
            });
        } else {
            console.log(`Product already exists: ${p.name}`);
        }
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
