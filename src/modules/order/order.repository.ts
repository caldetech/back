import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerTypes, OrderTypes, paymentMethodTypes } from 'src/enums';
import { orderSchema, type Order } from 'src/schemas/order';
import { z } from 'zod';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async updateOrder({
    orderId,
    slug,
    orderType,
    paymentMethod,
    paymentAmount,
    blingProducts,
    members,
    customer,
    ownerId,
    organizationId,
    showOrder,
    service,
    date,
    note,
  }: {
    orderId: string;
    slug: string;
    orderType: OrderTypes;
    paymentMethod: paymentMethodTypes;
    paymentAmount?: number;
    blingProducts: {
      id: string;
      nome: string;
      preco: number;
      precoCusto: number;
      quantity: number;
    }[];
    members: { id: string; name: string }[];
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
    service: string;
    date: Date;
    note: string;
  }) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        type: orderType,
        service,
        note,
        scheduling: date,
        show: showOrder,
        organization: {
          connect: { slug },
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
        payment: paymentAmount
          ? {
              upsert: {
                update: {
                  amount: paymentAmount,
                  method: paymentMethod,
                },
                create: {
                  amount: paymentAmount,
                  method: paymentMethod,
                },
              },
            }
          : undefined,
        assignedMembers: {
          deleteMany: {},
          create: members.map((member) => ({
            member: { connect: { id: member.id } },
          })),
        },
        productOrder: {
          deleteMany: {},
          create: blingProducts.map((product) => ({
            quantity: product.quantity,
            product: { connect: { blingId: product.id } },
          })),
        },
      },
    });
  }

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
    members,
    customer,
    ownerId,
    organizationId,
    service,
    showOrder,
    date,
    note,
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
    service: string;
    members: { id: string; name: string }[];
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
    note: string;
    date: Date;
  }) {
    return this.prisma.order.create({
      data: {
        type,
        show: showOrder,
        note,
        service,
        scheduling: date,
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
                create: {
                  blingId: element.id,
                  name: element.nome,
                  price: element.preco,
                  costPrice: element.precoCusto,
                  organization: {
                    connect: {
                      slug,
                    },
                  },
                },
              },
            };
          }),
        },
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

      const isPrivileged = [
        'ADMIN',
        'BILLING',
        'MANAGER',
        'BILLING',
        'DEV',
      ].includes(role);

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
          scheduling: true,
          service: true,
          note: true,
          show: true,
          customer: {
            select: {
              id: true,
              name: true,
              address: true,
              customerType: true,
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
        },
      });

      const total = await this.prisma.order.count({
        where: whereClause,
      });

      const rawOrderSchema = z.object({
        id: z.string(),
        type: z.string(),
        orderNumber: z.number(),
        scheduling: z.date(),
        note: z.string(),
        service: z.string(),
        show: z.boolean(),
        customer: z
          .object({
            id: z.string(),
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
        orderAttachment: z
          .array(
            z.object({
              id: z.string(),
              orderId: z.string(),
              filename: z.string(),
              url: z.string(),
              mimetype: z.string(),
              size: z.number(),
              createdAt: z.date(),
            }),
          )
          .nullable(),
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
      });

      const orderDTOSchema = rawOrderSchema.transform((order) => ({
        id: order.id,
        type: order.type,
        orderNumber: order.orderNumber,
        scheduling: order.scheduling,
        note: order.note,
        service: order.service,
        show: order.show,
        customerId: order.customer?.id ?? null,
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
        assignedMembers: order.assignedMembers?.map((am) => {
          return {
            memberId: am.member.id,
            memberName: am.member.user.name,
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
