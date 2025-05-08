import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { MemberService } from '../member/member.service';
import { OrganizationService } from '../organization/organization.service';
import { FastifyReply } from 'fastify';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly memberService: MemberService,
    private readonly organizationService: OrganizationService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/log-in')
  async logIn(
    @Body()
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    return await this.authService.logIn({ email, password, reply });
  }

  @UseGuards(AuthGuard)
  @Post('/profile')
  async getProfile(@Request() req, @Body() { slug }: { slug: string }) {
    const user = req.user;

    const organization =
      await this.organizationService.getOrganizationBySlug(slug);

    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }

    const membership = await this.memberService.getUserRoleInOrganization({
      userId: user.id,
      organizationId: organization.id,
    });

    if (!membership) {
      throw new NotFoundException('Membro não encontrado');
    }

    return {
      ...req.user,
      membership: membership.id,
      role: membership.role,
    };
  }
}
