import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { TokenRepository } from './token.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TokenController],
  providers: [TokenService, TokenRepository, PrismaService],
  exports: [TokenService],
})
export class TokenModule {}
