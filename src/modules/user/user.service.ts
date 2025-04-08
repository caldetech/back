import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { hash } from 'bcryptjs';
import { TokenService } from '../token/token.service';
import { EmailService } from '../email/email.service';
import { CreateUserDto } from 'src/schemas/create-user';
import { EmailTemplate } from 'src/components/ConfirmAccountEmailTemplate';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  async createUser({ name, email, password }: CreateUserDto) {
    const user = await this.userRepository.getUserByEmail(email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    try {
      const passwordHash = await hash(password, 6);

      const newUser = await this.userRepository.createUser({
        name,
        email,
        passwordHash,
      });

      console.log('newUser', newUser);

      const accountConfirmationToken = await this.tokenService.createToken({
        userId: newUser.id,
        type: 'CONFIRM_ACCOUNT',
      });

      console.log('accountConfirmationToken', accountConfirmationToken);

      this.emailService.sendEmail({
        type: 'CONFIRM_ACCOUNT',
        from: 'Caldetech <noreply@caldetech.com.br>',
        to: newUser.email,
        subject: 'Convite para plataforma de gestão da empresa',
        react: EmailTemplate({
          name: newUser.name,
          token: accountConfirmationToken.id,
        }),
      });
    } catch (error) {
      throw new BadRequestException('Error creating user', error.message);
    }

    return {
      success: true,
      message: 'User created successfully',
    };
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.getUserByEmail(email);
  }
}
