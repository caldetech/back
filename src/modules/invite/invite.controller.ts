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

@Controller('/invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
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
    const user = req.user;

    await this.inviteService.createInvite({
      slug,
      role,
      email,
      memberId: user.id,
    });
  }

  @Get('/all')
  @UseGuards(AuthGuard)
  async getInvites(
    @Request() req,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('slug') slug: string,
  ) {
    const user = req.user;

    return await this.inviteService.getInvites({
      page,
      limit,
      slug,
      memberId: user.id,
    });
  }
}
