import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { CreateOrganizationDto } from 'src/schemas/create-organization';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async createOrganization({ name, slug, userId }: CreateOrganizationDto) {
    const existingOrganization =
      await this.organizationRepository.getOrganizationBySlug(slug);

    if (existingOrganization) {
      throw new UnauthorizedException('Essa organização já existe');
    }

    return await this.organizationRepository.createOrganization({
      name,
      slug,
      userId,
    });
  }

  async getAllOrganizations({ userId }: { userId: string }) {
    return await this.organizationRepository.getAllOrganizations({ userId });
  }

  async getOrganizationBySlug(slug: string) {
    return await this.organizationRepository.getOrganizationBySlug(slug);
  }
}
