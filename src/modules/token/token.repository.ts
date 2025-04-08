import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Token } from 'src/schemas/token';

@Injectable()
export class TokenRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findTokenById(tokenId: string) {
    return { id: tokenId, value: 'sample-token' };
  }

  async createToken({ userId, type }: { userId: string; type: Token }) {
    const token = await this.prisma.token.create({
      data: {
        userId,
        type,
      },
    });

    return token;
  }

  async deleteToken(tokenId: string) {
    return { success: true };
  }
}
