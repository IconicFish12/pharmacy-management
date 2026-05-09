import { Module } from '@nestjs/common';
import { UploadService } from './upload.service.js';

@Module({
  providers: [UploadService],
})
export class UploadModule {}
