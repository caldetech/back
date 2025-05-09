import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthGuard } from '../auth/auth.guard';
import { CustomerTypes } from 'src/enums';
import { OrganizationContextGuard } from '../authorization/guards/organization-context.guard';
import { PoliciesGuard } from '../authorization/guards/policies.guard';

@Controller('/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/search')
  @UseGuards(AuthGuard)
  async searchCustomers(
    @Body() { slug, query }: { slug: string; query: string },
  ) {
    return this.customerService.searchCustomers({ query, slug });
  }

  @Post('/create')
  @UseGuards(AuthGuard)
  async createCustomer(
    @Body()
    {
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
    },
  ) {
    return await this.customerService.createCustomer({
      slug,
      customerType,
      name,
      document,
      address,
      mainNumber,
      contactNumber,
    });
  }

  @Get('/all')
  @UseGuards(AuthGuard, OrganizationContextGuard, PoliciesGuard)
  async getCustomers(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('slug') slug: string,
  ) {
    return await this.customerService.getCustomers({
      page,
      limit,
      slug,
    });
  }
}
