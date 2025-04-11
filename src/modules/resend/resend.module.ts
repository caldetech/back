import { Module } from '@nestjs/common';
import { ResendService } from './resend.service';
import { ResendController } from './resend.controller';
import { ResendProvider } from './resend.provider';

@Module({
  controllers: [ResendController],
  providers: [ResendService, ResendProvider],
  exports: [ResendService, ResendProvider],
})
export class ResendModule {}
