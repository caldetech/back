import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { CreateOrganizationDto } from 'src/schemas/create-organization';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async createOrganization({ name, slug, userId }: CreateOrganizationDto) {
    return this.organizationRepository.createOrganization({
      name,
      slug,
      userId,
    });
  }

  async getAllOrganizations({ userId }: { userId: string }) {
    return this.organizationRepository.getAllOrganizations({ userId });
  }

  async getOrganizationBySlug(slug: string) {
    return this.organizationRepository.getOrganizationBySlug(slug);
  }
}
