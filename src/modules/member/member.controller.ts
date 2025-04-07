import { Controller } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

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
