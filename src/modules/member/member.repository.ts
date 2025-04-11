import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { RoleTypes } from 'src/enums/role';
import type { Role } from 'src/schemas/role';

@Injectable()
export class MemberRepository {
  constructor(private readonly prisma: PrismaService) {}

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
