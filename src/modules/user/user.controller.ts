import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  createUserSchema,
  type CreateUserDto,
} from 'src/schemas/user/create-user';

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
}
