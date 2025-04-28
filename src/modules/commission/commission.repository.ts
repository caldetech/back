import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { z } from 'zod';

@Injectable()
export class CommissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCommissions({
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

      const commissions = await this.prisma.commission.findMany({
        skip,
        take: limit,
        where: {
          member: {
            organization: {
              slug,
            },
          },
        },
        select: {
          id: true,
          memberId: true,
          orderId: true,
          amount: true,

          member: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      const total = await this.prisma.commission.count({
        where: {
          member: {
            organization: {
              slug,
            },
          },
        },
      });

      const commissionSchema = z.object({
        id: z.string(),
        amount: z.number(),
        member: z.object({
          user: z.object({
            name: z.string(),
          }),
        }),
        memberId: z.string(),
        orderId: z.string(),
      });

      const commissionDTOSchema = commissionSchema.transform((commission) => ({
        id: commission.id,
        member: commission.member?.user?.name ?? null,
        amount: commission.amount,
        memberId: commission.memberId ?? null,
        orderId: commission.orderId,
      }));

      const filteredCommissions = commissions.map((commission) =>
        commissionDTOSchema.parse(commission),
      );

      return {
        data: filteredCommissions,
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
