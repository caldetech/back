import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AttachmentRepository } from './attachment.repository';

@Injectable()
export class AttachmentService {
  private readonly bucket: string;

  constructor(
    private readonly attachmentRepository: AttachmentRepository,
    private readonly config: ConfigService,
    private readonly s3: S3Client,
  ) {
    this.bucket = this.config.get<string>('AWS_BUCKET_NAME')!;

    console.log('Bucket:', this.bucket);

    if (!this.bucket) {
      throw new Error('AWS_BUCKET_NAME is missing from environment');
    }
  }

  async getAttachmentById({ id }: { id: string }) {
    return this.attachmentRepository.getAttachmentById({ id });
  }

  async getSignedUploadUrl(fileData: { filename: string; mimetype: string }) {
    const ext = extname(fileData.filename);
    const key = `uploads/${randomUUID()}${ext}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: fileData.mimetype,
    });

    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 60 });

    return {
      url: signedUrl,
      key,
    };
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
      await this.s3.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );
    } catch (e) {
      throw new NotFoundException('Arquivo não encontrado no S3.');
    }

    return await this.attachmentRepository.confirmUpload({
      orderId,
      filename,
      mimetype,
      size,
      key,
    });
  }
}
