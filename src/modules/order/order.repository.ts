import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerTypes, OrderTypes, paymentMethodTypes } from 'src/enums';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder({
    slug,
    type,
    paymentMethod,
    paymentAmount,
    products,
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
    products: {
      id: string;
      nome: string;
      preco: number;
      precoCusto: number;
      quantity: number;
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
    console.log({
      slug,
      type,
      paymentMethod,
      paymentAmount,
      products,
      members,
      commissionPercent,
      memberCommissions,
      customer,
      ownerId,
    });

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
      },
      include: {
        productOrders: true,
        assignedMembers: true,
        payments: true,
        commissions: true,
      },
    });
  }
}
