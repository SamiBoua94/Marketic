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
    ethicalScore?: number | null;
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
                  images: true,
                  ethicalScore: true,
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
                    images: true,
                    ethicalScore: true,
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

  async updateCartItem(cartItemId: string, quantity: number, userId: string): Promise<CartItemWithProduct> {
    try {
      // Vérifier que l'élément appartient bien à l'utilisateur
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
          cart: { userId }
        },
        include: {
          cart: true,
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            }
          }
        }
      });

      if (!cartItem) {
        throw new Error('Article non trouvé dans votre panier');
      }

      if (quantity <= 0) {
        await this.removeFromCart(cartItemId, userId);
        throw new Error('La quantité doit être supérieure à zéro');
      }

      const updatedItem = await prisma.cartItem.update({
        where: {
          id: cartItemId,
          cart: { userId } // Double vérification de sécurité
        },
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
      console.error('Erreur lors de la mise à jour du panier:', error);
      throw new Error(error instanceof Error ? error.message : 'Échec de la mise à jour du panier');
    }
  },

  async removeFromCart(cartItemId: string, userId: string): Promise<void> {
    try {
      // Vérifier que l'élément appartient bien à l'utilisateur avant suppression
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
          cart: { userId }
        }
      });

      if (!cartItem) {
        throw new Error('Article non trouvé dans votre panier');
      }

      await prisma.cartItem.delete({
        where: {
          id: cartItemId,
          cart: { userId } // Double vérification de sécurité
        }
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      throw new Error(error instanceof Error ? error.message : 'Échec de la suppression de l\'article');
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
