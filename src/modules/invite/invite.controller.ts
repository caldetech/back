import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InviteService } from './invite.service';
import { Role } from 'src/schemas/role';
import { PoliciesGuard } from '../authorization/guards/policies.guard';
import { OrganizationContextGuard } from '../authorization/guards/organization-context.guard';
import { AuthGuard } from '../auth/auth.guard';
import { CheckPoliciesFromRole } from '../authorization/decorators/check-policies-from-role.decorator';

@Controller('/invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @CheckPoliciesFromRole((ability) => ability.can('create', 'Invite'))
  @UseGuards(AuthGuard, OrganizationContextGuard, PoliciesGuard)
  async createInvite(
    @Request() req,
    @Body()
    {
      email,
      role,
      slug,
    }: {
      email: string;
      role: Role;
      slug: string;
    },
  ) {
    // const authorId = req.user.id;
    console.log(req.user);

    // await this.inviteService.createInvite({
    //   email,
    //   role,
    //   authorId,
    //   organizationId,
    // });
  }
}
