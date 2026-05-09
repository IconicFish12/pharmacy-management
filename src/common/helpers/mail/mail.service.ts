import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailerService.name);
    constructor(private readonly mailer: MailerService){}

    async restockRequest() {
        await this.mailer.sendMail({

        });
    } 
}
