import { Controller, Post, Body } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';


const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: { accessKeyId: process.env.S3_ACCESS_KEY!, secretAccessKey: process.env.S3_SECRET_KEY! },
});



@Controller('uploads')
export class UploadsController {
  @Post()

  async uploadFile(
    @Body() body: { filename: string; contentType: string },
  ): Promise<{ url: string; storageKey: string }> {
    // your logic here
    return {
      url: 'https://example.com/upload',
      storageKey: 'some-key',
    };
  }
}

