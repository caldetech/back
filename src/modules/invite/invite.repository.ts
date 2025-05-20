import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from 'src/schemas/role';

@Injectable()
export class InviteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteinviteById({ inviteId }: { inviteId: string }) {
    try {
      return await this.prisma.invite.delete({
        where: {
          id: inviteId,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getInviteBySlugAndOrganizationId({
    email,
    organizationId,
  }: {
    email: string;
    organizationId: string;
  }) {
    try {
      const invite = await this.prisma.invite.findUnique({
        where: {
          email_organizationId: {
            email,
            organizationId,
          },
        },
      });

      return invite;
    } catch (error) {
      console.log(error);
    }
  }

  async getInviteById({ inviteId }: { inviteId: string }) {
    try {
      const invite = await this.prisma.invite.findUnique({
        where: {
          id: inviteId,
        },
      });

      return invite;
    } catch (error) {
      console.log(error);
    }
  }

  async createInvite({
    email,
    role,
    memberId,
    organizationId,
  }: {
    email: string;
    role: Role;
    memberId: string;
    organizationId: string;
  }) {
    try {
      const invite = await this.prisma.invite.create({
        data: {
          email,
          role,
          memberId,
          organizationId,
        },
      });

      return invite;
    } catch (error) {
      console.log(error);
    }
  }

  async getInvites({
    page,
    limit,
    slug,
    memberId,
  }: {
    page: number;
    limit: number;
    slug: string;
    memberId: string;
  }) {
    try {
      const skip = (page - 1) * limit;

      const invites = await this.prisma.invite.findMany({
        skip,
        take: limit,
        where: {
          memberId,
        },
        select: {
          id: true,
          email: true,
        },
      });

      const total = await this.prisma.invite.count({
        where: {
          memberId,
        },
      });

      return {
        data: invites,
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
