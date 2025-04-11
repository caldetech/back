// src/comissions/comissions.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByOrderId(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        comission: {
          include: {
            assigned_comissions: {
              include: {
                member: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.assignedComission.findMany({
      where: {
        member: {
          userId,
        },
      },
      include: {
        comission: true,
      },
    });
  }
}
