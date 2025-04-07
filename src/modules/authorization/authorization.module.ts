import { forwardRef, Module } from '@nestjs/common';
import { CaslModule } from '../casl/casl.module';
import { PoliciesGuard } from './guards/policies.guard';
import { Reflector } from '@nestjs/core';
import { OrganizationModule } from '../organization/organization.module';
import { MemberModule } from '../member/member.module';
import { OrganizationContextGuard } from './guards/organization-context.guard';

@Module({
  imports: [forwardRef(() => OrganizationModule), CaslModule, MemberModule],
  providers: [PoliciesGuard, Reflector, OrganizationContextGuard],
  exports: [PoliciesGuard, OrganizationContextGuard],
})
export class AuthorizationModule {}
