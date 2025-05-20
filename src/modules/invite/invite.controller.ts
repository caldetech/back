import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InviteService } from './invite.service';
import { Role } from 'src/schemas/role';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/invites')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async createInvite(
    @Body()
    {
      email,
      role,
      slug,
      memberId,
    }: {
      email: string;
      role: Role;
      slug: string;
      memberId: string;
    },
  ) {
    await this.inviteService.createInvite({
      slug,
      role,
      email,
      memberId,
    });
  }

  @Get('/get-all')
  @UseGuards(AuthGuard)
  async getInvites(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('slug') slug: string,
    @Query('memberId') memberId: string,
  ) {
    return await this.inviteService.getInvites({
      page,
      limit,
      slug,
      memberId,
    });
  }
}
