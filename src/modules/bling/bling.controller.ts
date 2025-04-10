import { Body, Controller, Get, Post } from '@nestjs/common';
import { BlingService } from './bling.service';

@Controller('/bling')
export class BlingController {
  constructor(private readonly blingService: BlingService) {}

  @Get('/get-authorize-url')
  async getAuthorizeUrl() {
    return await this.blingService.getAuthorizeUrl();
  }

  @Post('/get-tokens')
  async getTokens(@Body('code') code: string) {
    return await this.blingService.getTokens({ code });
  }
}
