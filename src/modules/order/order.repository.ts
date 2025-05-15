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
    type,
    paymentMethod,
    paymentAmount,
    blingProducts,
    members,
    memberCommissions,
    customer,
    ownerId,
    organizationId,
    showOrder,
  }: {
    orderId: string;
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
    members: { id: string; name: string }[];
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
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        type,
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
        singleCommission: {
          deleteMany: {},
          create: memberCommissions.map((member) => ({
            value: member.value,
            member: { connect: { id: member.memberId } },
          })),
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
      include: {
        assignedMembers: true,
        payment: true,
        singleCommission: true,
        productOrder: true,
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
    memberCommissions,
    customer,
    ownerId,
    organizationId,
    showOrder,
    scheduleDate,
    scheduleTime,
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
    members: { id: string; name: string }[];
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
    scheduleDate: Date;
    scheduleTime: Date;
    note: string;
  }) {
    return this.prisma.order.create({
      data: {
        type,
        show: showOrder,
        scheduleDate,
        scheduleTime,
        note: {
          create: {
            note,
          },
        },
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
        singleCommission: {
          create: memberCommissions.map((member) => {
            return {
              value: member.value,
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
        singleCommission: true,
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
          singleCommission: {
            select: {
              value: true,
              memberid: true,
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
        singleCommission: z
          .array(
            z.object({
              value: z.number(),
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
          const singleCommission = order.singleCommission?.find(
            (c) => c.memberId === am.member.id,
          );
          return {
            memberId: am.member.id,
            memberName: am.member.user.name,
            percentage: singleCommission?.value ?? null,
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
