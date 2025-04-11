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
import { TokenModule } from './modules/token/token.module';
import { EmailModule } from './modules/email/email.module';
import { ResendModule } from './modules/resend/resend.module';
import { BlingModule } from './modules/bling/bling.module';
import { ServiceModule } from './modules/service/service.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ComissionModule } from './modules/comission/comission.module';

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
    TokenModule,
    EmailModule,
    ResendModule,
    BlingModule,
    ServiceModule,
    CustomerModule,
    ComissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
