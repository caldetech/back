import {
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
  BeforeApplicationShutdown,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaShutdownService
  implements OnApplicationShutdown, BeforeApplicationShutdown, OnModuleDestroy
{
  constructor(private readonly prismaService: PrismaService) {}

  async beforeApplicationShutdown(signal: string) {
    await this.prismaService.$disconnect();
  }

  async onApplicationShutdown(signal: string) {
    await this.prismaService.$disconnect();
  }

  async onModuleDestroy() {
    await this.prismaService.$disconnect();
  }
}
