import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { ServiceRepository } from './service.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService, ServiceRepository, PrismaService],
})
export class ServiceModule {}
