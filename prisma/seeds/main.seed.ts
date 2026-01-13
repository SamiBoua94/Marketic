import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/utils/helpers';

async function main() {
    console.log('🌱 Starting database seed...');

    try {
        // Delete existing data in the correct order
        console.log('🗑️  Cleaning database...');
        await prisma.product.deleteMany({});
        await prisma.shop.deleteMany({});
        await prisma.user.deleteMany({});

        // Create test users
        console.log('👤 Creating test users...');
        const hashedPassword = await hashPassword('TestPassword123');

        const user1 = await prisma.user.create({
            data: {
                email: 'shop1@example.com',
                password: hashedPassword,
                name: 'Shop Owner 1',
                description: 'First test shop owner',
            },
        });

        const user2 = await prisma.user.create({
            data: {
                email: 'shop2@example.com',
                password: hashedPassword,
                name: 'Shop Owner 2',
                description: 'Second test shop owner',
            },
        });

        const adminUser = await prisma.user.create({
            data: {
                email: 'admin@example.com',
                password: hashedPassword,
                name: 'Admin User',
                description: 'Administrator',
            },
        });

        console.log(`✅ Created ${3} users`);

        // Create test shops
        console.log('🏪 Creating test shops...');
        const shop1 = await prisma.shop.create({
            data: {
                name: 'Ethical Fashion Store',
                description: 'Sustainable and ethical fashion products',
                address: '123 Main Street',
                city: 'Paris',
                postalCode: '75001',
                email: 'contact@ethicalfashion.com',
                phone: '+33123456789',
                siret: '12345678901234',
                instagram: '@ethicalfashion',
                facebook: 'ethicalfashion',
                tags: JSON.stringify(['eco-friendly', 'sustainable', 'fashion']),
                userId: user1.id,
            },
        });

        const shop2 = await prisma.shop.create({
            data: {
                name: 'Artisan Crafts',
                description: 'Handmade artisan products with local materials',
                address: '456 Craft Lane',
                city: 'Lyon',
                postalCode: '69000',
                email: 'info@artisancrafts.com',
                phone: '+33987654321',
                siret: '98765432109876',
                instagram: '@artisancrafts',
                tags: JSON.stringify(['handmade', 'artisan', 'local']),
                userId: user2.id,
            },
        });

        console.log(`✅ Created ${2} shops`);

        // Create test products
        console.log('📦 Creating test products...');
        const products = [
            {
                name: 'Organic Cotton T-Shirt',
                description: 'High-quality organic cotton t-shirt, perfect for everyday wear',
                price: 29.99,
                stock: 50,
                category: 'Fashion',
                tags: JSON.stringify(['cotton', 'organic', 'sustainable']),
                shopId: shop1.id,
            },
            {
                name: 'Eco-Friendly Jeans',
                description: 'Sustainable jeans made from recycled denim',
                price: 79.99,
                stock: 30,
                category: 'Fashion',
                tags: JSON.stringify(['eco-friendly', 'denim', 'sustainable']),
                shopId: shop1.id,
            },
            {
                name: 'Handmade Ceramic Mug',
                description: 'Beautiful handcrafted ceramic mug by local artisans',
                price: 24.99,
                stock: 25,
                category: 'Home & Garden',
                tags: JSON.stringify(['handmade', 'ceramic', 'artisan']),
                shopId: shop2.id,
            },
            {
                name: 'Wooden Spoon Set',
                description: 'Set of 3 handcrafted wooden spoons',
                price: 34.99,
                stock: 40,
                category: 'Home & Garden',
                tags: JSON.stringify(['wooden', 'handmade', 'kitchen']),
                shopId: shop2.id,
            },
        ];

        for (const product of products) {
            await prisma.product.create({ data: product });
        }

        console.log(`✅ Created ${products.length} products`);

        console.log('✨ Database seed completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();
