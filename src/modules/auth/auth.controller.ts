import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  async signIn(
    @Body()
    { email, password }: { email: string; password: string },
  ) {
    return this.authService.signIn(email, password);
  }
}
