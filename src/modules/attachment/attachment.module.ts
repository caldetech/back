import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { AttachmentRepository } from './attachment.repository';
import { PrismaService } from '../prisma/prisma.service';
import { S3Module } from '../s3/s3.module';
import { OrganizationModule } from '../organization/organization.module';
import { MemberModule } from '../member/member.module';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [S3Module, OrganizationModule, MemberModule, CaslModule],
  controllers: [AttachmentController],
  providers: [AttachmentService, AttachmentRepository, PrismaService],
})
export class AttachmentModule {}
