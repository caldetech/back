import { Get, Injectable, Query, UseGuards } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { Customer } from 'src/schemas/customer';
import { CustomerTypes } from 'src/enums';
import { AuthGuard } from '../auth/auth.guard';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async searchCustomers({ slug, query }: { slug: string; query: string }) {
    return this.customerRepository.searchCustomers({ query, slug });
  }

  async createCustomer({
    slug,
    customerType,
    name,
    document,
    address,
    mainNumber,
    contactNumber,
  }: {
    slug: string;
    customerType: CustomerTypes;
    name: string;
    document: string;
    address: string;
    mainNumber: string;
    contactNumber: string;
  }) {
    return await this.customerRepository.createCustomer({
      slug,
      customerType,
      name,
      document,
      address,
      mainNumber,
      contactNumber,
    });
  }

  async getCustomers({
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

    return await this.customerRepository.getCustomers({
      page: numericPage,
      limit: numericLimit,
      slug,
    });
  }
}
