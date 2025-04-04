import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserSchema, type CreateUserDto } from 'src/schemas/create-user';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up')
  async signUp(
    @Body()
    { name, email, password }: CreateUserDto,
  ) {
    const validatedFields = createUserSchema.safeParse({
      name,
      email,
      password,
    });

    if (!validatedFields.success) {
      throw new Error(validatedFields.error.message);
    }

    const { data } = validatedFields;

    return this.userService.createUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });
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
