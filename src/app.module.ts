import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { CaslModule } from './modules/casl/casl.module';
import { AuthorizationModule } from './modules/authorization/authorization.module';
import { MemberModule } from './modules/member/member.module';
import { InviteModule } from './modules/invite/invite.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    OrganizationModule,
    CaslModule,
    AuthorizationModule,
    MemberModule,
    InviteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
