import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from 'src/schemas/create-organization';

@Injectable()
export class OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrganization({ name, slug, userId }: CreateOrganizationDto) {
    try {
      const organization = await this.prisma.organization.create({
        data: {
          name,
          slug,
          ownerId: userId,
          members: {
            create: {
              userId,
              role: 'ADMIN',
            },
          },
        },
      });

      return organization;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllOrganizations({ userId }: { userId: string }) {
    try {
      const organizations = await this.prisma.organization.findMany({
        where: {
          members: {
            some: {
              userId,
            },
          },
        },
        include: {
          members: {
            where: {
              userId,
            },
            take: 1,
          },
        },
      });

      return organizations;
    } catch (error) {
      console.log(error);
    }
  }

  async getOrganizationBySlug(slug: string) {
    try {
      const organization = await this.prisma.organization.findUnique({
        where: {
          slug,
        },
      });

      return organization;
    } catch (error) {
      console.log(error);
    }
  }
}
