import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('/search')
  @UseGuards(AuthGuard)
  async searchMember(@Body() { slug, query }: { slug: string; query: string }) {
    return this.memberService.searchMember({ query, slug });
  }

  async getUserRoleInOrganization({
    userId,
    organizationId,
  }: {
    userId: string;
    organizationId: string;
  }) {
    return this.memberService.getUserRoleInOrganization({
      userId,
      organizationId,
    });
  }
}
