import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BlingService } from './bling.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/bling')
export class BlingController {
  constructor(private readonly blingService: BlingService) {}

  @Post('/search')
  @UseGuards(AuthGuard)
  async searchCProducts(
    @Body() { slug, query }: { slug: string; query: string },
  ) {
    return this.blingService.searchProducts({ query, slug });
  }

  @Post('/get-authorize-url')
  @UseGuards(AuthGuard)
  async getAuthorizeUrl(@Body() { slug }: { slug: string }) {
    return await this.blingService.getAuthorizeUrl({ slug });
  }

  @Post('/get-tokens')
  @UseGuards(AuthGuard)
  async getTokens(@Body() { code, state }: { code: string; state: string }) {
    return await this.blingService.getTokens({ code, slug: state });
  }

  @Post('/get-valid-access-token')
  @UseGuards(AuthGuard)
  async getValidAccessToken(@Body() { slug }: { slug: string }) {
    return await this.blingService.getValidAccessToken({ slug });
  }

  @Get('/get-products')
  @UseGuards(AuthGuard)
  async getProducts(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('slug') slug: string,
  ) {
    const blingTokens = await this.blingService.getValidAccessToken({ slug });

    if (!blingTokens) {
      throw new BadRequestException('Erro ao obter tokens do Bling');
    }

    return await this.blingService.getProducts({
      accessToken: blingTokens.accessToken,
      page,
      limit,
    });
  }
}
