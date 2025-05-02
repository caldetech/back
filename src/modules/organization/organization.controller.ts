import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationContextGuard } from '../authorization/guards/organization-context.guard';
import { AuthGuard } from '../auth/auth.guard';
import { PoliciesGuard } from '../authorization/guards/policies.guard';
import { CheckPoliciesFromRole } from '../authorization/decorators/check-policies-from-role.decorator';
import type { AppAbility } from '../casl/types/casl.types';

@Controller('/organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  @CheckPoliciesFromRole((ability: AppAbility) =>
    ability.can('manage', 'Organization'),
  )
  async createOrganization(
    @Request() req,
    @Body() { name, slug }: { name: string; slug: string },
  ) {
    console.log('Tem permissão');

    return this.organizationService.createOrganization({
      name,
      slug,
      userId: req.user.id,
    });
  }

  @Get('/all')
  @UseGuards(AuthGuard)
  async getAllOrganizations(@Request() req) {
    return this.organizationService.getAllOrganizations({
      userId: req.user.id,
    });
  }

  @Get('/by-slug/:slug')
  @UseGuards(AuthGuard, OrganizationContextGuard, PoliciesGuard)
  async getOrganizationBySlug(@Body() slug: string) {
    const organization =
      await this.organizationService.getOrganizationBySlug(slug);

    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    return organization;
  }
}
