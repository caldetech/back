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
      authorId: user.id,
    });
  }
}
