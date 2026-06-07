import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it } from 'vitest';
import { MailService } from '../../../../../src/common/helpers/mail/mail.service.ts';
import { MailerService } from '@nestjs-modules/mailer';

describe('MailService', () => {
  let service: MailService;

  const mockMailerService = {
    sendMail: () => Promise.resolve(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MailerService, useValue: mockMailerService },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
