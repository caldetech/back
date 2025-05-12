import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerTypes, OrderTypes, paymentMethodTypes } from 'src/enums';
import { orderSchema, type Order } from 'src/schemas/order';
import { z } from 'zod';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async updateOrderVisibility({
    orderId,
    showOrder,
  }: {
    orderId: string;
    showOrder: boolean;
  }) {
    return await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        show: showOrder,
      },
    });
  }

  async createOrder({
    slug,
    type,
    paymentMethod,
    paymentAmount,
    blingProducts,
    services,
    storedProducts,
    members,
    commissionPercent,
    memberCommissions,
    customer,
    ownerId,
    organizationId,
    showOrder,
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
    services: {
      id: string;
      title: string;
      price: number;
    }[];
    storedProducts: {
      id: string;
      name: string;
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
    showOrder: boolean;
  }) {
    return this.prisma.order.create({
      data: {
        type,
        show: showOrder,
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
              percentage: member.value,
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
        serviceOrder: {
          create: services.map((element) => {
            return {
              service: {
                connect: {
                  id: element.id,
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
    role,
    memberId,
  }: {
    page: number;
    limit: number;
    slug: string;
    role: string;
    memberId: string;
  }) {
    try {
      const skip = (page - 1) * limit;

      const isPrivileged = ['ADMIN', 'BILLING', 'MANAGER'].includes(role);

      const whereClause = isPrivileged
        ? {
            organization: { slug },
          }
        : {
            organization: { slug },
            OR: [{ show: true }, { assignedMembers: { some: { memberId } } }],
          };

      const orders = await this.prisma.order.findMany({
        skip,
        take: limit,
        where: whereClause,
        select: {
          id: true,
          type: true,
          status: true,
          orderNumber: true,
          show: true,
          customer: {
            select: {
              name: true,
              address: true,
              customerType: true,
            },
          },
          serviceOrder: {
            select: {
              service: {
                select: {
                  id: true,
                  title: true,
                  price: true,
                },
              },
            },
          },
          payment: {
            select: {
              status: true,
              amount: true,
              method: true,
            },
          },
          orderAttachment: true,
          productOrder: {
            select: {
              product: {
                select: {
                  blingId: true,
                  name: true,
                  costPrice: true,
                  price: true,
                },
              },
              quantity: true,
            },
          },
          assignedMembers: {
            select: {
              member: {
                select: {
                  id: true,
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          commissions: {
            select: {
              percentage: true,
              memberId: true,
            },
          },
        },
      });

      const total = await this.prisma.order.count({
        where: whereClause,
      });

      const rawOrderSchema = z.object({
        id: z.string(),
        type: z.string(),
        orderNumber: z.number(),
        show: z.boolean(),
        customer: z
          .object({
            name: z.string(),
            address: z.string(),
            customerType: z.enum(['COMPANY', 'PERSON']),
          })
          .nullable(),
        payment: z
          .object({
            status: z.string(),
            amount: z.number(),
            method: z.enum([
              'PIX',
              'CARTAO',
              'BOLETO',
              'DINHEIRO',
              'DEPOSITO',
              'PENDENTE',
            ]),
          })
          .nullable(),
        status: z.string(),
        orderAttachment: z.array(
          z.object({
            id: z.string(),
            orderId: z.string(),
            filename: z.string(),
            url: z.string(),
            mimetype: z.string(),
            size: z.number(),
            createdAt: z.date(),
          }),
        ),
        productOrder: z
          .array(
            z.object({
              product: z.object({
                blingId: z.bigint(),
                name: z.string(),
                price: z.number(),
                costPrice: z.number(),
              }),
              quantity: z.number(),
            }),
          )
          .nullable(),
        serviceOrder: z
          .array(
            z.object({
              service: z.object({
                id: z.string(),
                title: z.string(),
                price: z.number(),
              }),
            }),
          )
          .nullable(),
        assignedMembers: z
          .array(
            z.object({
              member: z.object({
                id: z.string(),
                user: z.object({
                  name: z.string(),
                }),
              }),
            }),
          )
          .nullable(),
        commissions: z
          .array(
            z.object({
              percentage: z.number(),
              memberId: z.string(),
            }),
          )
          .optional(),
      });

      const orderDTOSchema = rawOrderSchema.transform((order) => ({
        id: order.id,
        type: order.type,
        orderNumber: order.orderNumber,
        show: order.show,
        customer: order.customer?.name ?? null,
        address: order.customer?.address ?? null,
        customerType: order.customer?.customerType ?? null,
        payment: order.payment?.status ?? null,
        method: order.payment?.method ?? null,
        amount: order.payment?.amount ?? null,
        status: order.status,
        orderAttachment: order.orderAttachment,
        productOrder: order.productOrder?.map((po) => ({
          blingId:
            typeof po.product.blingId === 'bigint'
              ? Number(po.product.blingId)
              : po.product.blingId,
          productName: po.product.name,
          price: po.product.price,
          costPrice: po.product.costPrice,
          quantity: po.quantity,
        })),
        serviceOrder: order.serviceOrder?.map((po) => ({
          id: po.service.id,
          title: po.service.title,
          price: po.service.price,
        })),
        assignedMembers: order.assignedMembers?.map((am) => {
          const commission = order.commissions?.find(
            (c) => c.memberId === am.member.id,
          );
          return {
            memberId: am.member.id,
            memberName: am.member.user.name,
            percentage: commission?.percentage ?? null,
          };
        }),
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
