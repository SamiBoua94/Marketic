import { prisma } from '@/lib/prisma';
import { cartService } from './cart.service';

export const orderService = {
  async createOrder(userId: string, shippingInfo: any, paymentInfo: any) {
    const cart = await cartService.getOrCreateUserCart(userId);
    
    if (!cart.items?.length) {
      throw new Error('Le panier est vide');
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + (item.quantity * item.product.price);
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        shippingInfo: shippingInfo || {},
        paymentInfo: paymentInfo || {},
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    await cartService.clearCart(userId);
    return order;
  },

  async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  async getOrderById(orderId: string, userId: string) {
    return prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
  },

  async updateOrderStatus(orderId: string, status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') {
    return prisma.order.update({
      where: { id: orderId },
      data: { 
        status: status as any // Type assertion nécessaire car Prisma attend un type spécifique
      }
    });
  }
};
