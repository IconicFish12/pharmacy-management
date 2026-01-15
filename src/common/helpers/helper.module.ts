import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { ExportModule } from './export/export.module';
import { PaymentsModule } from './payments/payments.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [MailModule, ExportModule, PaymentsModule, UploadModule],
})
export class HelperModule {}
