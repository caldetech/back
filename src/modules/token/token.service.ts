import { Injectable } from '@nestjs/common';
import { TokenRepository } from './token.repository';
import { Token } from 'src/schemas/token';

@Injectable()
export class TokenService {
  constructor(private readonly tokenRepository: TokenRepository) {}
  async findTokenById(tokenId: string) {
    return this.tokenRepository.findTokenById(tokenId);
  }

  async createToken({ userId, type }: { userId: string; type: Token }) {
    return this.tokenRepository.createToken({ userId, type });
  }

  async deleteToken(tokenId: string) {
    return this.tokenRepository.deleteToken(tokenId);
  }
}
