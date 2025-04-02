import {
  Body,
  Controller,
  Param,
  Post,
  Query,
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
    console.log(slug);
    console.log(req.user.id);
    console.log(name);

    return this.organizationService.createOrganization({
      name,
      slug,
      userId: req.user.id,
    });
  }
}
