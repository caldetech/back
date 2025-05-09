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
import { OrganizationContextGuard } from '../authorization/guards/organization-context.guard';
import { PoliciesGuard } from '../authorization/guards/policies.guard';
import { CheckPoliciesFromRole } from '../authorization/decorators/check-policies-from-role.decorator';
import type { AppAbility } from '../casl/types/casl.types';

@Controller('/bling')
export class BlingController {
  constructor(private readonly blingService: BlingService) {}

  @Post('/search')
  @UseGuards(AuthGuard)
  @CheckPoliciesFromRole((ability: AppAbility) => ability.can('get', 'Bling'))
  async searchCProducts(
    @Body() { slug, query }: { slug: string; query: string },
  ) {
    return this.blingService.searchProducts({ query, slug });
  }

  @Post('/get-authorize-url')
  @UseGuards(AuthGuard)
  @CheckPoliciesFromRole((ability: AppAbility) => ability.can('get', 'Bling'))
  async getAuthorizeUrl(@Body() { slug }: { slug: string }) {
    return await this.blingService.getAuthorizeUrl({ slug });
  }

  @Post('/get-tokens')
  @UseGuards(AuthGuard)
  @CheckPoliciesFromRole((ability: AppAbility) => ability.can('get', 'Bling'))
  async getTokens(@Body() { code, state }: { code: string; state: string }) {
    return await this.blingService.getTokens({ code, slug: state });
  }

  @Post('/get-valid-access-token')
  @UseGuards(AuthGuard)
  @CheckPoliciesFromRole((ability: AppAbility) => ability.can('get', 'Bling'))
  async getValidAccessToken(@Body() { slug }: { slug: string }) {
    return await this.blingService.getValidAccessToken({ slug });
  }

  @Get('/get-products')
  @UseGuards(AuthGuard)
  @CheckPoliciesFromRole((ability: AppAbility) => ability.can('get', 'Bling'))
  async getProducts(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('slug') slug: string,
  ) {
    const blingTokens = await this.blingService.getValidAccessToken({ slug });

    if ('accessToken' in blingTokens) {
      return await this.blingService.getProducts({
        accessToken: blingTokens.accessToken,
        page,
        limit,
      });
    }

    return {
      success: false,
      message: 'Erro ao buscar produtos',
    };
  }
}
