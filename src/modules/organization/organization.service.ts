import { Injectable } from '@nestjs/common';
import type { CreateOrganizationProps } from 'src/interfaces/create-organization';
import { OrganizationRepository } from './organization.repository';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async createOrganization({ name, slug, userId }: CreateOrganizationProps) {
    return this.organizationRepository.createOrganization({
      name,
      slug,
      userId,
    });
  }
}
