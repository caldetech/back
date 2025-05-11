import { Injectable } from '@nestjs/common';
import { ServiceRepository } from './service.repository';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async searchService({ slug, query }: { slug: string; query: string }) {
    return this.serviceRepository.searchService({ query, slug });
  }

  async createService({
    slug,
    title,
    description,
    price,
  }: {
    slug: string;
    title: string;
    description?: string;
    price: number;
  }) {
    return await this.serviceRepository.createService({
      slug,
      title,
      description,
      price,
    });
  }

  async getServices({
    page,
    limit,
    slug,
  }: {
    page: number;
    limit: number;
    slug: string;
  }) {
    const numericPage = Number(page);
    const numericLimit = Number(limit);

    return await this.serviceRepository.getServices({
      page: numericPage,
      limit: numericLimit,
      slug,
    });
  }
}
