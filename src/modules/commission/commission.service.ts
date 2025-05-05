import { Injectable } from '@nestjs/common';
import { CommissionRepository } from './commission.repository';

@Injectable()
export class Commissionservice {
  constructor(private readonly commissionRepository: CommissionRepository) {}

  async getCommissions({
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

    return await this.commissionRepository.getCommissions({
      page: numericPage,
      limit: numericLimit,
      slug,
    });
  }
}
