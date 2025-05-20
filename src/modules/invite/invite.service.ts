import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InviteRepository } from './invite.repository';
import { Role } from 'src/schemas/role';
import { OrganizationService } from '../organization/organization.service';
import { MemberService } from '../member/member.service';
import { EmailService } from '../email/email.service';
import { EmailTemplate } from 'src/components/EmailTemplate';
import { EmailTypes } from 'src/enums';
import { UserService } from '../user/user.service';

@Injectable()
export class InviteService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly inviteRepository: InviteRepository,
    private readonly organizationService: OrganizationService,
    private readonly memberService: MemberService,
    private readonly emailService: EmailService,
  ) {}

  async deleteinviteById({ inviteId }: { inviteId: string }) {
    return await this.inviteRepository.deleteinviteById({ inviteId });
  }

  async getInviteByEmailAndOrganizationId({
    email,
    organizationId,
  }: {
    email: string;
    organizationId: string;
  }) {
    return await this.inviteRepository.getInviteBySlugAndOrganizationId({
      email,
      organizationId,
    });
  }

  async getInviteById({ inviteId }: { inviteId: string }) {
    return await this.inviteRepository.getInviteById({ inviteId });
  }

  async createInvite({
    slug,
    role,
    email,
    memberId,
  }: {
    role: Role;
    slug: string;
    email: string;
    memberId: string;
  }) {
    const organization =
      await this.organizationService.getOrganizationBySlug(slug);

    if (!organization) {
      throw new UnauthorizedException('Organização não encontrada');
    }

    const member = await this.memberService.getMemberByEmailAndOrganizationId({
      email,
      organizationId: organization.id,
    });

    if (member) {
      throw new UnauthorizedException(
        'Esse usuário já é um membro da organização',
      );
    }

    const isInvitation = await this.getInviteByEmailAndOrganizationId({
      email,
      organizationId: organization.id,
    });

    if (isInvitation) {
      await this.deleteinviteById({ inviteId: isInvitation.id });
    }

    const user = await this.userService.getUserByEmail(email);

    if (user) {
      await this.memberService.createMember({
        role,
        userId: user.id,
        organizationId: organization.id,
      });

      return {
        success: true,
        message: 'Usuário adicionado a organização',
      };
    }

    const invite = await this.inviteRepository.createInvite({
      role,
      email,
      memberId,
      organizationId: organization.id,
    });

    if (!invite) {
      throw new BadRequestException('Erro ao criar convite');
    }

    this.emailService.sendEmail({
      from: 'Caldetech <noreply@caldetech.com.br>',
      to: email,
      subject: 'Convite para plataforma de gestão da empresa',
      react: EmailTemplate({
        type: EmailTypes.INVITE_USER,
        inviteId: invite.id,
      }),
    });

    return {
      success: true,
      message: 'Convite enviado com sucesso',
    };
  }

  async getInvites({
    page,
    limit,
    slug,
    memberId,
  }: {
    page: number;
    limit: number;
    slug: string;
    memberId: string;
  }) {
    const numericPage = Number(page);
    const numericLimit = Number(limit);

    return await this.inviteRepository.getInvites({
      page: numericPage,
      limit: numericLimit,
      slug,
      memberId,
    });
  }
}
