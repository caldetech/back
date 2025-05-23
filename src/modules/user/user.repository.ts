import { Catch, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from 'src/schemas/role';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUserByInvite({
    name,
    role,
    email,
    inviteId,
    passwordHash,
    organizationId,
  }: {
    role: Role;
    name: string;
    email: string;
    inviteId: string;
    passwordHash: string;
    organizationId: string;
  }) {
    try {
      return await this.prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          member_on: {
            create: {
              organizationId,
              role,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updatePassword({
    userId,
    passwordHash,
  }: {
    userId: string;
    passwordHash: string;
  }) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,
      },
    });
  }

  async confirmAccount({ userId }: { userId: string }) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: 'ACTIVE',
      },
    });
  }

  async createUser({
    name,
    email,
    passwordHash,
  }: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
      });

      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async getUsers({
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

      const users = await this.prisma.user.findMany({
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        skip,
        take: limit,
        where: {
          member_on: {
            some: {
              organization: {
                slug,
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          number: true,
          status: true,
        },
      });

      const total = await this.prisma.user.count({
        where: {
          member_on: {
            some: {
              organization: {
                slug,
              },
            },
          },
        },
      });

      return {
        data: users,
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
