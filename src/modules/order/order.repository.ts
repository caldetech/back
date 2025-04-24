import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerTypes, OrderTypes, paymentMethodTypes } from 'src/enums';
import { orderSchema, type Order } from 'src/schemas/order';
import { z } from 'zod';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder({
    slug,
    type,
    paymentMethod,
    paymentAmount,
    blingProducts,
    storedProducts,
    members,
    commissionPercent,
    memberCommissions,
    customer,
    ownerId,
    organizationId,
  }: {
    slug: string;
    type: OrderTypes;
    paymentMethod: paymentMethodTypes;
    paymentAmount?: number;
    blingProducts: {
      id: string;
      nome: string;
      preco: number;
      precoCusto: number;
      quantity: number;
    }[];
    storedProducts: {
      id: string;
      nome: string;
      blingId: BigInt;
      createdAt: Date;
      updatedAt: Date;
      organizationId: string;
    }[];
    members: { id: string; name: string }[];
    commissionPercent: number;
    memberCommissions: { memberId: string; value: number }[];
    customer: {
      id: string;
      customerType: CustomerTypes;
      name: string;
      mainNumber: string;
      contactNumber: string;
      address: string;
    };
    ownerId: string;
    organizationId: string;
  }) {
    return this.prisma.order.create({
      data: {
        type,
        organization: {
          connect: {
            slug,
          },
        },
        owner: {
          connect: {
            organizationId_userId: {
              organizationId,
              userId: ownerId,
            },
          },
        },
        customer: {
          connect: {
            id: customer.id,
          },
        },
        commissions: {
          create: memberCommissions.map((member) => {
            return {
              amount: member.value,
              member: {
                connect: {
                  id: member.memberId,
                },
              },
            };
          }),
        },
        payment: {
          create: paymentAmount
            ? {
                amount: paymentAmount,
                method: paymentMethod,
              }
            : undefined,
        },
        assignedMembers: {
          create: members.map((element) => {
            return {
              member: {
                connect: {
                  id: element.id,
                },
              },
            };
          }),
        },
        productOrder: {
          create: blingProducts.map((element) => {
            return {
              quantity: element.quantity,
              product: {
                connect: {
                  blingId: element.id,
                },
              },
            };
          }),
        },
      },
      include: {
        assignedMembers: true,
        payment: true,
        commissions: true,
        productOrder: true,
      },
    });
  }

  async getOrders({
    page,
    limit,
    slug,
  }: {
    page: number;
    limit: number;
    slug: string;
  }) {
    try {
      const skip = (page - 1) * limit;

      const orders = await this.prisma.order.findMany({
        skip,
        take: limit,
        where: {
          organization: {
            slug,
          },
        },
        select: {
          id: true,
          type: true,
          status: true,
          customer: {
            select: {
              name: true,
            },
          },
          payment: {
            select: {
              status: true,
            },
          },
        },
      });

      const total = await this.prisma.service.count({
        where: {
          organization: {
            slug,
          },
        },
      });

      const rawOrderSchema = z.object({
        id: z.string(),
        type: z.string(),
        customer: z
          .object({
            name: z.string(),
          })
          .nullable(),
        payment: z
          .object({
            status: z.string(),
          })
          .nullable(),
        status: z.string(),
      });

      const orderDTOSchema = rawOrderSchema.transform((order) => ({
        id: order.id,
        type: order.type,
        customer: order.customer?.name ?? null,
        payment: order.payment?.status ?? null,
        status: order.status,
      }));

      const filteredOrders = orders.map((order) => orderDTOSchema.parse(order));

      return {
        data: filteredOrders,
        page: {
          total,
        },
      };
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}
