import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from 'src/schemas/roles';

@Injectable()
export class InviteRepository {
  constructor(private readonly prisma: PrismaService) {}

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
    await this.prisma.invite.create({
      data: {
        email,
        role,
        authorId,
        organizationId,
      },
    });
  }
}
