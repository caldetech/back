import { forwardRef, Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { PrismaService } from '../prisma/prisma.service';
import { InviteRepository } from './invite.repository';
import { OrganizationModule } from '../organization/organization.module';
import { CaslModule } from '../casl/casl.module';
import { MemberModule } from '../member/member.module';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    OrganizationModule,
    CaslModule,
    MemberModule,
    EmailModule,
  ],
  controllers: [InviteController],
  providers: [InviteService, PrismaService, InviteRepository],
  exports: [InviteService],
})
export class InviteModule {}
