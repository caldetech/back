import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ProductRepository } from './product.repository';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports: [OrganizationModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService, ProductRepository],
  exports: [ProductService],
})
export class ProductModule {}
