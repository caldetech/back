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

@Controller('/organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post('/:slug/create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async createOrganization(
    @Param('slug') slug: string,
    @Request() req,
    @Body() { name }: { name: string },
  ) {
    return this.organizationService.createOrganization({
      name,
      slug,
      userId: req.user.id,
    });
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getAllOrganizations(@Request() req) {
    return this.organizationService.getAllOrganizations({
      userId: req.user.id,
    });
  }

  @Get('/by-slug/:slug')
  @HttpCode(HttpStatus.OK)
  async getOrganizationBySlug(@Body() slug: string) {
    const organization =
      await this.organizationService.getOrganizationBySlug(slug);

    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    return organization;
  }
}
