import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async searchMember({ slug, query }: { slug: string; query: string }) {
    return this.memberRepository.searchMember({ query, slug });
  }

  async getUserRoleInOrganization({
    userId,
    organizationId,
  }: {
    userId: string;
    organizationId: string;
  }) {
    return this.memberRepository.getUserRoleInOrganization({
      userId,
      organizationId,
    });
  }

  async createMember({ userId, role, organizationId }) {
    return await this.memberRepository.createMember({
      userId,
      role,
      organizationId,
    });
  }

  async getMemberByEmailAndOrganizationId({
    email,
    organizationId,
  }: {
    email: string;
    organizationId: string;
  }) {
    return await this.memberRepository.getMemberByEmailAndOrganizationId({
      email,
      organizationId,
    });
  }
}
