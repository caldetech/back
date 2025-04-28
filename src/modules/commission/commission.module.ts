import { Module } from '@nestjs/common';
import { Commissionservice } from './commission.service';
import { CommissionController } from './commission.controller';
import { CommissionRepository } from './commission.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CommissionController],
  providers: [Commissionservice, CommissionRepository, PrismaService],
})
export class CommissionModule {}
