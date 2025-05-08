import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { FastifyReply } from 'fastify';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async logIn({
    email,
    password,
    reply,
  }: {
    email: string;
    password: string;
    reply: FastifyReply;
  }): Promise<{ message: string }> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const isPasswordValid = await compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    if (user.status === 'PENDING') {
      throw new UnauthorizedException(
        'Sua conta ainda não foi ativada. Verifique seu e-mail.',
      );
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };

    const token = await this.jwtService.signAsync(payload);

    reply.setCookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    return { message: 'Login bem-sucedido' };
  }
}
