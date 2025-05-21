import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { hash } from 'bcryptjs';
import { TokenService } from '../token/token.service';
import { EmailService } from '../email/email.service';
import { CreateUserDto } from 'src/schemas/create-user';
import { EmailTemplate } from 'src/components/EmailTemplate';
import { EmailTypes } from 'src/enums';
import { MemberService } from '../member/member.service';
import { OrganizationService } from '../organization/organization.service';
import { InviteService } from '../invite/invite.service';
import type { Role } from 'src/schemas/role';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => InviteService))
    private readonly inviteService: InviteService,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly memberService: MemberService,
    private readonly organizationService: OrganizationService,
  ) {}

  async createUserByInvite({
    name,
    role,
    email,
    inviteId,
    passwordHash,
    organizationId,
  }: {
    role: Role;
    name: string;
    email: string;
    inviteId: string;
    passwordHash: string;
    organizationId: string;
  }) {
    return await this.userRepository.createUserByInvite({
      name,
      role,
      email,
      inviteId,
      passwordHash,
      organizationId,
    });
  }

  async updatePassword({
    tokenId,
    password,
  }: {
    tokenId: string;
    password: string;
  }) {
    const tokenData = await this.tokenService.findTokenById(tokenId);

    if (!tokenData) {
      throw new BadRequestException('Token inválido');
    }

    const user = await this.userRepository.getUserById(tokenData.userId);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const passwordHash = await hash(password, 6);

    const updatedUser = await this.userRepository.updatePassword({
      userId: user.id,
      passwordHash,
    });

    if (updatedUser) {
      await this.tokenService.deleteToken(tokenId);
    }

    return updatedUser;
  }

  async confirmAccount({ tokenId }: { tokenId: string }) {
    const tokenData = await this.tokenService.findTokenById(tokenId);

    if (!tokenData) {
      throw new BadRequestException('Token inválido');
    }

    const user = await this.userRepository.getUserById(tokenData.userId);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const confirmedAccount = await this.userRepository.confirmAccount({
      userId: user.id,
    });

    if (confirmedAccount) {
      await this.tokenService.deleteToken(tokenId);
      await this.inviteService.updateInviteStatus(confirmedAccount.email);
    }

    return confirmedAccount;
  }

  async createUser({
    name,
    email,
    tokenId,
    password,
    inviteId,
  }: CreateUserDto) {
    const user = await this.userRepository.getUserByEmail(email);

    if (user) {
      throw new BadRequestException('Usuário já existe');
    }

    try {
      const passwordHash = await hash(password, 6);

      if (inviteId) {
        const invite = await this.inviteService.getInviteById({ inviteId });

        if (invite) {
          try {
            const newUser = await this.userRepository.createUserByInvite({
              name,
              email,
              passwordHash,
              role: invite.role,
              inviteId: invite.id,
              organizationId: invite.organizationId,
            });

            if (!newUser) {
              throw new BadRequestException('Erro ao criar usuário');
            }

            const accountConfirmationToken =
              await this.tokenService.createToken({
                userId: newUser.id,
                type: EmailTypes.CONFIRM_ACCOUNT,
              });

            this.emailService.sendEmail({
              from: 'Caldetech <noreply@caldetech.com.br>',
              to: newUser.email,
              subject: 'Convite para plataforma de gestão da empresa',
              react: EmailTemplate({
                type: EmailTypes.CONFIRM_ACCOUNT,
                name: newUser.name,
                tokenId: accountConfirmationToken.id,
              }),
            });
          } catch (error) {
            throw new BadRequestException(
              'Erro ao criar o usuário',
              error.message,
            );
          }

          return {
            success: true,
            message: 'Usuário criado com sucesso',
          };
        }
      }

      const newUser = await this.userRepository.createUser({
        name,
        email,
        passwordHash,
      });

      const accountConfirmationToken = await this.tokenService.createToken({
        userId: newUser.id,
        type: EmailTypes.CONFIRM_ACCOUNT,
      });

      this.emailService.sendEmail({
        from: 'Caldetech <noreply@caldetech.com.br>',
        to: newUser.email,
        subject: 'Convite para plataforma de gestão da empresa',
        react: EmailTemplate({
          type: EmailTypes.CONFIRM_ACCOUNT,
          name: newUser.name,
          tokenId: accountConfirmationToken.id,
        }),
      });
    } catch (error) {
      throw new BadRequestException('Erro ao criar o usuário', error.message);
    }

    return {
      success: true,
      message: 'Usuário criado com sucesso',
    };
  }

  async passwordRecover({ email }: { email: string }) {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException('Endereço de e-mail inválido');
    }

    try {
      const passwordRecoverToken = await this.tokenService.createToken({
        userId: user.id,
        type: EmailTypes.PASSWORD_RECOVER,
      });

      this.emailService.sendEmail({
        from: 'Caldetech <noreply@caldetech.com.br>',
        to: user.email,
        subject: 'Recuperação de senha',
        react: EmailTemplate({
          type: EmailTypes.PASSWORD_RECOVER,
          name: user.name,
          tokenId: passwordRecoverToken.id,
        }),
      });
    } catch (error) {
      throw new BadRequestException('Erro ao recuperar senha', error.message);
    }

    return {
      success: true,
      message: 'Recuperação de senha enviada',
    };
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.getUserByEmail(email);
  }

  async getUsers({
    page,
    limit,
    slug,
  }: {
    page: number;
    limit: number;
    slug: string;
  }) {
    const numericPage = Number(page);
    const numericLimit = Number(limit);

    return await this.userRepository.getUsers({
      page: numericPage,
      limit: numericLimit,
      slug,
    });
  }
}
