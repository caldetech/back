import { Body, Controller, Get, Post } from '@nestjs/common';
import { AttachmentService } from './attachment.service';

@Controller('/attachments')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Post('/get-by-id')
  async getAttachmentById(@Body() { id }: { id: string }) {
    return this.attachmentService.getAttachmentById({ id });
  }

  @Post('/sign-upload')
  async signUpload(@Body() fileData: { filename: string; mimetype: string }) {
    return this.attachmentService.getSignedUploadUrl(fileData);
  }

  @Post('/confirm-upload')
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
