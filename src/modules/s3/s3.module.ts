import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { createS3Client } from './s3.config';

@Module({
  imports: [ConfigModule],
  controllers: [S3Controller],
  providers: [
    {
      provide: S3Client,
      useFactory: createS3Client,
      inject: [ConfigService],
    },
    S3Service,
  ],
  exports: [S3Client, S3Service],
})
export class S3Module {}
