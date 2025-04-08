import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { TokenModule } from '../token/token.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TokenModule, EmailModule],
  providers: [UserService, UserRepository, PrismaService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
