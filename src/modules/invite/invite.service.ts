import { Injectable } from '@nestjs/common';
import { InviteRepository } from './invite.repository';
import { Role } from 'src/schemas/role';

@Injectable()
export class InviteService {
  constructor(private readonly inviteRepository: InviteRepository) {}

  async createInvite({
    email,
    role,
    authorId,
    organizationId,
  }: {
    email: string;
    role: Role;
    authorId: string;
    organizationId: string;
  }) {
    await this.inviteRepository.createInvite({
      email,
      role,
      authorId,
      organizationId,
    });
  }
}
