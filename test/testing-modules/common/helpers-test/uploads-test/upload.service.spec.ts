import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it } from 'vitest';
import { UploadService } from '../../../../../src/common/helpers/upload/upload.service.ts';

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
