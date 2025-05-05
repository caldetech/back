import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createService({
    slug,
    title,
    description,
    price,
  }: {
    slug: string;
    title: string;
    description?: string;
    price: number;
  }) {
    try {
      return await this.prisma.service.create({
        data: {
          title,
          description,
          price,
          organization: {
            connect: {
              slug,
            },
          },
        },
        include: {
          organization: true,
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async getServices({
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

      const services = await this.prisma.service.findMany({
        skip,
        take: limit,
        where: {
          organization: {
            slug,
          },
        },
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
        },
      });

      const total = await this.prisma.service.count({
        where: {
          organization: {
            slug,
          },
        },
      });

      return {
        data: services,
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
