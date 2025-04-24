import { Body, Controller, Post } from '@nestjs/common';
import { AttachmentService } from './attachment.service';

@Controller('/attachments')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Post('/sign-upload')
  async signUpload(@Body() fileData: { filename: string; mimetype: string }) {
    return this.attachmentService.getSignedUploadUrl(fileData);
  }

  @Post('/confirm-upload')
  async confirmUpload(
    @Body()
    fileData: {
      orderId: string;
      filename: string;
      mimetype: string;
      size: number;
      key: string;
    },
  ) {
    return this.attachmentService.confirmUpload(fileData);
  }
}
