import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Commissionservice } from './commission.service';
import { OrganizationContextGuard } from '../authorization/guards/organization-context.guard';
import { PoliciesGuard } from '../authorization/guards/policies.guard';
import { CheckPoliciesFromRole } from '../authorization/decorators/check-policies-from-role.decorator';
import type { AppAbility } from '../casl/types/casl.types';

@Controller('/commissions')
export class CommissionController {
  constructor(private readonly commissionservice: Commissionservice) {}

  @Get('/all')
  @UseGuards(AuthGuard, OrganizationContextGuard, PoliciesGuard)
  @CheckPoliciesFromRole((ability: AppAbility) =>
    ability.can('get', 'Commission'),
  )
  async getCommissions(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('slug') slug: string,
  ) {
    return await this.commissionservice.getCommissions({
      page,
      limit,
      slug,
    });
  }
}
