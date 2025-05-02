import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { CheckPoliciesFromRole } from '../authorization/decorators/check-policies-from-role.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { OrganizationContextGuard } from '../authorization/guards/organization-context.guard';
import { PoliciesGuard } from '../authorization/guards/policies.guard';
import type { AppAbility } from '../casl/types/casl.types';

@Controller('/attachments')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Post('/get-by-id')
  @UseGuards(AuthGuard, OrganizationContextGuard, PoliciesGuard)
  @CheckPoliciesFromRole((ability: AppAbility) =>
    ability.can('get', 'Attachment'),
  )
  async getAttachmentById(@Body() { id }: { id: string }) {
    return this.attachmentService.getAttachmentById({ id });
  }

  @Post('/sign-upload')
  @UseGuards(AuthGuard, OrganizationContextGuard, PoliciesGuard)
  @CheckPoliciesFromRole((ability: AppAbility) =>
    ability.can('manage', 'Attachment'),
  )
  async signUpload(@Body() fileData: { filename: string; mimetype: string }) {
    return this.attachmentService.getSignedUploadUrl(fileData);
  }

  @Post('/confirm-upload')
  @UseGuards(AuthGuard, OrganizationContextGuard, PoliciesGuard)
  @CheckPoliciesFromRole((ability: AppAbility) =>
    ability.can('manage', 'Attachment'),
  )
  async confirmUpload(
    @Body()
    {
      orderId,
      filename,
      mimetype,
      size,
      key,
    }: {
      orderId: string;
      filename: string;
      mimetype: string;
      size: number;
      key: string;
    },
  ) {
    return this.attachmentService.confirmUpload({
      orderId,
      filename,
      mimetype,
      size,
      key,
    });
  }
}
