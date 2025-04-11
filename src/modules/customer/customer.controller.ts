import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthGuard } from '../auth/auth.guard';
import { Customer } from 'src/schemas/customer';
import { CustomerTypes } from 'src/enums';

@Controller('/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

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
  @UseGuards(AuthGuard)
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
