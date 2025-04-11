import { Module } from '@nestjs/common';
import { ComissionService } from './comission.service';
import { ComissionController } from './comission.controller';
import { ComissionRepository } from './comission.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ComissionController],
  providers: [ComissionService, ComissionRepository, PrismaService],
})
export class ComissionModule {}
