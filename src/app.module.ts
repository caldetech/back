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
import { CustomerModule } from './modules/customer/customer.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';
import { AttachmentModule } from './modules/attachment/attachment.module';
import { S3Module } from './modules/s3/s3.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    CustomerModule,
    OrderModule,
    ProductModule,
    AttachmentModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
