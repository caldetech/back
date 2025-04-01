import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateOrganizationInterface } from 'src/interfaces/create-organization';

@Injectable()
export class OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrganization({
    name,
    slug,
    domain,
    userId,
  }: CreateOrganizationInterface) {
    try {
      const organization = await this.prisma.organization.create({
        data: {
          name,
          slug,
          domain,
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
}
