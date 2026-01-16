import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module.js';
import { ExportModule } from './export/export.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { UploadModule } from './upload/upload.module.js';

@Module({
  imports: [MailModule, ExportModule, PaymentsModule, UploadModule],
})
export class HelperModule {}
