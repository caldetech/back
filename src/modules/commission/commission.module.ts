import { Module } from '@nestjs/common';
import { Commissionservice } from './commission.service';
import { CommissionController } from './commission.controller';
import { CommissionRepository } from './commission.repository';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationModule } from '../organization/organization.module';
import { MemberModule } from '../member/member.module';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [OrganizationModule, MemberModule, CaslModule],
  controllers: [CommissionController],
  providers: [Commissionservice, CommissionRepository, PrismaService],
})
export class CommissionModule {}
