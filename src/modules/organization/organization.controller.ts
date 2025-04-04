import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @UseGuards(AuthGuard)
  @Post('/:slug/create')
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

  @UseGuards(AuthGuard)
  @Get('/all')
  async getAllOrganizations(@Request() req) {
    return this.organizationService.getAllOrganizations({
      userId: req.user.id,
    });
  }
}
