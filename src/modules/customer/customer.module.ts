import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerRepository } from './customer.repository';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationModule } from '../organization/organization.module';
import { MemberModule } from '../member/member.module';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [OrganizationModule, MemberModule, CaslModule],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository, PrismaService],
})
export class CustomerModule {}
