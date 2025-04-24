import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AttachmentRepository {
  private readonly bucket: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.bucket = this.config.get<string>('AWS_BUCKET_NAME')!;
  }

  async confirmUpload(fileData: {
    orderId: string;
    filename: string;
    mimetype: string;
    size: number;
    key: string;
  }) {
    try {
      const attachment = await this.prisma.orderAttachment.create({
        data: {
          filename: fileData.filename,
          url: `https://${this.bucket}.s3.amazonaws.com/${fileData.key}`,
          mimetype: fileData.mimetype,
          size: fileData.size,
          order: {
            connect: { id: fileData.orderId },
          },
        },
      });

      return attachment;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao salvar anexo', error);
    }
  }
}
