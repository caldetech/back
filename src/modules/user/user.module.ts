import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { TokenModule } from '../token/token.module';
import { EmailModule } from '../email/email.module';
import { MemberModule } from '../member/member.module';
import { OrganizationModule } from '../organization/organization.module';
import { InviteModule } from '../invite/invite.module';
import { BlingModule } from '../bling/bling.module';

@Module({
  imports: [
    forwardRef(() => InviteModule),
    TokenModule,
    EmailModule,
    MemberModule,
    OrganizationModule,
    BlingModule,
  ],
  providers: [UserService, UserRepository, PrismaService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
