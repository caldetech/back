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

  async getAttachmentById({ id }: { id: string }) {
    try {
      const attachment = await this.prisma.orderAttachment.findUnique({
        where: {
          id,
        },
      });

      return attachment;
    } catch (error) {
      console.log(error);
    }
  }

  async confirmUpload({
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
  }) {
    try {
      const attachment = await this.prisma.orderAttachment.upsert({
        where: {
          orderId,
        },
        update: {
          filename,
          url: `https://${this.bucket}.s3.amazonaws.com/${key}`,
          mimetype,
          size,
        },
        create: {
          filename,
          url: `https://${this.bucket}.s3.amazonaws.com/${key}`,
          mimetype,
          size,
          order: {
            connect: {
              id: orderId,
            },
          },
        },
      });

      return attachment;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao salvar anexo', error);
    }
  }
}
