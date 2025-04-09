import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { hash } from 'bcryptjs';
import { TokenService } from '../token/token.service';
import { EmailService } from '../email/email.service';
import { CreateUserDto } from 'src/schemas/create-user';
import { EmailTemplate } from 'src/components/EmailTemplate';
import { EmailTypes } from 'src/enums';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

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

    return this.userRepository.updatePassword({
      userId: user.id,
      passwordHash,
    });
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

    return this.userRepository.confirmAccount({ userId: user.id });
  }

  async createUser({ name, email, password }: CreateUserDto) {
    const user = await this.userRepository.getUserByEmail(email);

    if (user) {
      throw new BadRequestException('Usuário já existe');
    }

    try {
      const passwordHash = await hash(password, 6);

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
          token: accountConfirmationToken.id,
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
          token: passwordRecoverToken.id,
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
}
