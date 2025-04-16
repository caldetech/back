import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerTypes } from 'src/enums';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async searchCustomers({ query, slug }: { query: string; slug: string }) {
    try {
      const customers = await this.prisma.customer.findMany({
        where: {
          organization: {
            slug,
          },
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        take: 3,
        orderBy: { name: 'asc' },
        select: {
          id: true,
          customerType: true,
          name: true,
          mainNumber: true,
          contactNumber: true,
          address: true,
        },
      });

      return customers;
    } catch (error) {
      console.log(error);
    }
  }

  async createCustomer({
    slug,
    customerType,
    name,
    document,
    address,
    mainNumber,
    contactNumber,
  }: {
    slug: string;
    customerType: CustomerTypes;
    name: string;
    document: string;
    address: string;
    mainNumber: string;
    contactNumber: string;
  }) {
    try {
      return await this.prisma.customer.create({
        data: {
          customerType,
          name,
          document,
          address,
          mainNumber,
          contactNumber,
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

  async getCustomers({
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

      const customers = await this.prisma.customer.findMany({
        skip,
        take: limit,
        where: {
          organization: {
            slug,
          },
        },
        select: {
          id: true,
          name: true,
          customerType: true,
          mainNumber: true,
          contactNumber: true,
          address: true,
        },
      });

      const total = await this.prisma.customer.count({
        where: {
          organization: {
            slug,
          },
        },
      });

      return {
        data: customers,
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
