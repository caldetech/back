import { Module } from '@nestjs/common';
import { BlingService } from './bling.service';
import { BlingController } from './bling.controller';
import { AuthModule } from '../auth/auth.module';
import { OrganizationModule } from '../organization/organization.module';
import { BlingRepository } from './bling.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [AuthModule, OrganizationModule],
  controllers: [BlingController],
  providers: [BlingService, BlingRepository, PrismaService],
})
export class BlingModule {}
