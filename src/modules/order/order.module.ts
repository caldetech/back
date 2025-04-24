import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationModule } from '../organization/organization.module';
import { CustomerModule } from '../customer/customer.module';
import { MemberModule } from '../member/member.module';
import { OrderRepository } from './order.repository';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [OrganizationModule, CustomerModule, MemberModule, ProductModule],
  controllers: [OrderController],
  providers: [OrderService, PrismaService, OrderRepository],
})
export class OrderModule {}
