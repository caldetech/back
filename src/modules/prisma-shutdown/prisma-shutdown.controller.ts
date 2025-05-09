import { Controller } from '@nestjs/common';
import { PrismaShutdownService } from './prisma-shutdown.service';

@Controller('prisma-shutdown')
export class PrismaShutdownController {
  constructor(private readonly prismaShutdownService: PrismaShutdownService) {}
}
