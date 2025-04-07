import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { PrismaService } from '../prisma/prisma.service';
import { InviteRepository } from './invite.repository';
import { OrganizationModule } from '../organization/organization.module';
import { CaslModule } from '../casl/casl.module';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [OrganizationModule, CaslModule, MemberModule],
  controllers: [InviteController],
  providers: [InviteService, PrismaService, InviteRepository],
})
export class InviteModule {}
