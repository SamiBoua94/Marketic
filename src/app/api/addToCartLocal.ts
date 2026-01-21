'use server';

import editJsonFile from 'edit-json-file';
import path from 'path';
import { mockProducts } from '@/lib/mock-data';

export async function addToCartLocal(productId: string) {
    const product = mockProducts.find((p) => p.id === productId);

    if (!product) {
        console.error(`Product with ID ${productId} not found`);
        return;
    }

    const file = editJsonFile(path.join(process.cwd(), 'cart.json'));

    // Create a unique key or list for items. 
    // Since edit-json-file set() overwrites keys, using a simple list approach 
    // or a timestamp-based key might be better for multiple items.
    // However, for a simple "store product name and price", let's simply append to an array called 'items'.

    file.append('items', {
        id: product.id,
        name: product.name,
        price: product.price,
        addedAt: new Date().toISOString()
    });

    file.save();
    console.log(`Added ${product.name} to local cart`);
}

export async function getCartLocal() {
    const file = editJsonFile(path.join(process.cwd(), 'cart.json'));
    const items = file.get('items') as any[] || [];

    // Aggregate items by ID
    const groupedItems: Record<string, number> = {};
    items.forEach((item) => {
        groupedItems[item.id] = (groupedItems[item.id] || 0) + 1;
    });

    // Map to full product details
    const cartItems = Object.entries(groupedItems).map(([id, quantity]) => {
        const product = mockProducts.find((p) => p.id === id);
        if (!product) return null;

        return {
            id,
            quantity,
            product
        };
    }).filter(Boolean); // Remote nulls

    return cartItems;
}

