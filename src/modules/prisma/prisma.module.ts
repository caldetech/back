import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaShutdownModule } from '../prisma-shutdown/prisma-shutdown.module';

@Module({
  imports: [PrismaShutdownModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
