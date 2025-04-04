import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    const user = await this.userRepository.getUserByEmail(email);

    if (user) {
      throw new Error('User already exists');
    }

    const passwordHash = await hash(password, 6);

    return await this.userRepository.createUser({
      name,
      email,
      passwordHash,
    });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.getUserByEmail(email);
  }
}
