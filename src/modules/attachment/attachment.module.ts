import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { AttachmentRepository } from './attachment.repository';
import { PrismaService } from '../prisma/prisma.service';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [S3Module],
  controllers: [AttachmentController],
  providers: [AttachmentService, AttachmentRepository, PrismaService],
})
export class AttachmentModule {}
