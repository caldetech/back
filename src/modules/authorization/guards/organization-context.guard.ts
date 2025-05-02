import {
  CanActivate,
  ForbiddenException,
  Injectable,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { MemberService } from 'src/modules/member/member.service';
import { OrganizationService } from 'src/modules/organization/organization.service';

@Injectable()
export class OrganizationContextGuard implements CanActivate {
  constructor(
    private organizationService: OrganizationService,
    private memberService: MemberService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const query = { ...request.query };
    const body = { ...request.body };
    const querySlug = query.slug;
    const bodySlug = body.slug;
    const slug = querySlug || bodySlug;
    const user = request.user;
    const organization =
      await this.organizationService.getOrganizationBySlug(slug);

    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }

    const role = await this.memberService.getUserRoleInOrganization({
      userId: user.id,
      organizationId: organization.id,
    });

    if (!role) {
      throw new ForbiddenException('Você não faz parte desta organização');
    }

    request.organization = organization;
    request.user.organizationRole = role;

    return true;
  }
}
