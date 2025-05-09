import { Module } from '@nestjs/common';
import { PrismaShutdownService } from './prisma-shutdown.service';
import { PrismaShutdownController } from './prisma-shutdown.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PrismaShutdownController],
  providers: [PrismaShutdownService, PrismaService],
  exports: [PrismaShutdownService],
})
export class PrismaShutdownModule {}
