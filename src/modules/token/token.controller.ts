import { Controller } from '@nestjs/common';
import { TokenService } from './token.service';
import type { Token } from 'src/schemas/token';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
  async findTokenById(tokenId: string) {
    return this.tokenService.findTokenById(tokenId);
  }

  async createToken({ userId, type }: { userId: string; type: Token }) {
    return this.tokenService.createToken({ userId, type });
  }

  async deleteToken(tokenId: string) {
    return this.tokenService.deleteToken(tokenId);
  }
}
