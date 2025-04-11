import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerRepository } from './customer.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository, PrismaService],
})
export class CustomerModule {}
