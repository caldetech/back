import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { RoleTypes } from 'src/enums/role';
import type { Role } from 'src/schemas/role';

@Injectable()
export class MemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async searchMember({ query, slug }: { query: string; slug: string }) {
    try {
      const members = await this.prisma.user.findMany({
        where: {
          member_on: {
            some: {
              organization: {
                slug,
              },
            },
          },
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        take: 3,
        orderBy: { name: 'asc' },
        include: {
          member_on: {
            where: {
              organization: {
                slug,
              },
            },
            select: {
              id: true,
            },
          },
        },
      });

      return members.map((element) => {
        return {
          name: element.name,
          id: element.member_on[0].id,
        };
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getUserRoleInOrganization({
    userId,
    organizationId,
  }: {
    userId: string;
    organizationId: string;
  }) {
    try {
      const member = await this.prisma.member.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId,
          },
        },
        select: {
          id: true,
          role: true,
        },
      });

      return member;
    } catch (error) {
      console.log(error);
    }
  }

  async createMember({
    userId,
    role,
    organizationId,
  }: {
    userId: string;
    role: Role;
    organizationId: string;
  }) {
    try {
      const member = await this.prisma.member.create({
        data: {
          userId,
          role,
          organizationId,
        },
      });

      return member;
    } catch (error) {
      console.log(error);
    }
  }

  async getMemberByEmailAndOrganizationId({
    email,
    organizationId,
  }: {
    email: string;
    organizationId: string;
  }) {
    try {
      const member = await this.prisma.member.findFirst({
        where: {
          organizationId,
          user: {
            email,
          },
        },
        select: {
          user: true,
        },
      });

      return member;
    } catch (error) {
      console.log(error);
    }
  }
}
