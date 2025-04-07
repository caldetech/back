import { forwardRef, Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { OrganizationRepository } from './organization.repository';
import { PrismaService } from '../prisma/prisma.service';
import { CaslModule } from '../casl/casl.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [forwardRef(() => AuthorizationModule), CaslModule, MemberModule],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationRepository, PrismaService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
