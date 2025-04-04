import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  createUserSchema,
  type CreateUserDto,
} from 'src/schemas/user/create-user';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up')
  async signUp(
    @Body()
    { name, email, passwordHash }: CreateUserDto,
  ) {
    const parsedData = createUserSchema.safeParse({
      name,
      email,
      passwordHash,
    });

    if (parsedData.success) {
      await this.userService.createUser(parsedData.data);
    }

    return {
      success: parsedData.success,
      message: parsedData.success ? 'User created' : parsedData.error.message,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/by-email')
  async getUserByEmail(
    @Query('email')
    email: string,
  ) {
    return this.userService.getUserByEmail(email);
  }
}
