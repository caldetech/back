import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { OrganizationService } from '../organization/organization.service';
import type { OrganizationDto } from 'src/schemas/organization';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly organizationService: OrganizationService,
  ) {}

  async createProducts({ slug, blingProducts }) {
    const organization =
      await this.organizationService.getOrganizationBySlug(slug);

    if (!organization) {
      throw new BadRequestException('Organização não encontrada');
    }

    return await this.productRepository.createProducts({
      organizationId: organization.id,
      blingProducts,
    });
  }
}
