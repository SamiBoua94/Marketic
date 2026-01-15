import { prisma } from '@/lib/prisma';

type CartItemWithProduct = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    // Ajoutez d'autres champs de produit nécessaires
  };
};

type CartWithItems = {
  id: string;
  userId: string;
  items: CartItemWithProduct[];
};

export const cartService = {
  async getOrCreateUserCart(userId: string): Promise<CartWithItems> {
    try {
      let cart = await prisma.cart.findUnique({
        where: { userId },
        include: { 
          items: { 
            include: { 
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  // Ajoutez d'autres champs de produit nécessaires
                }
              } 
            } 
          } 
        }
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { 
            userId,
            items: {
              create: []
            }
          },
          include: { 
            items: { 
              include: { 
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  }
                } 
              } 
            } 
          }
        });
      }

      return cart as CartWithItems;
    } catch (error) {
      console.error('Error in getOrCreateUserCart:', error);
      throw new Error('Failed to get or create user cart');
    }
  },

  async addToCart(userId: string, productId: string, quantity: number = 1): Promise<CartItemWithProduct> {
    try {
      const cart = await this.getOrCreateUserCart(userId);

      const existingItem = cart.items.find(item => item.productId === productId);

      if (existingItem) {
        const updatedItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { 
            quantity: {
              increment: quantity
            } 
          },
          include: { 
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              }
            } 
          }
        });
        
        return updatedItem as CartItemWithProduct;
      }

      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        },
        include: { 
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            }
          } 
        }
      });

      return newItem as CartItemWithProduct;
    } catch (error) {
      console.error('Error in addToCart:', error);
      throw new Error('Failed to add item to cart');
    }
  },

  async updateCartItem(cartItemId: string, quantity: number): Promise<CartItemWithProduct | void> {
    try {
      if (quantity <= 0) {
        return this.removeFromCart(cartItemId);
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
        include: { 
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            }
          } 
        }
      });

      return updatedItem as CartItemWithProduct;
    } catch (error) {
      console.error('Error in updateCartItem:', error);
      throw new Error('Failed to update cart item');
    }
  },

  async removeFromCart(cartItemId: string): Promise<void> {
    try {
      await prisma.cartItem.delete({
        where: { id: cartItemId }
      });
    } catch (error) {
      console.error('Error in removeFromCart:', error);
      throw new Error('Failed to remove item from cart');
    }
  },

  async clearCart(userId: string): Promise<void> {
    try {
      const cart = await this.getOrCreateUserCart(userId);
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    } catch (error) {
      console.error('Error in clearCart:', error);
      throw new Error('Failed to clear cart');
    }
  }
};
