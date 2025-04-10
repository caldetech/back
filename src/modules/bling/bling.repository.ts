import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async updateOrCreateTokens({
    organizationId,
    accessToken,
    refreshToken,
    expiresAt,
  }) {
    try {
      const tokens = await this.prisma.blingToken.upsert({
        where: { organizationId },
        update: {
          accessToken,
          refreshToken,
          expiresAt,
        },
        create: {
          organizationId,
          accessToken,
          refreshToken,
          expiresAt,
        },
      });

      return tokens;
    } catch (error) {
      console.log(error.message);
      throw new Error(error);
    }
  }

  async getTokensByOrganizationId(organizationId: string) {
    try {
      const tokens = await this.prisma.blingToken.findUnique({
        where: {
          organizationId,
        },
      });

      return tokens;
    } catch (error) {
      console.log(error.message);
      throw new Error(error);
    }
  }

  async getTokensByOrganizationSlug(organizationId: string) {
    try {
      const tokens = await this.prisma.blingToken.findUnique({
        where: {
          organizationId,
        },
      });

      return tokens;
    } catch (error) {
      console.log(error.message);
      throw new Error(error);
    }
  }
}
