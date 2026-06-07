import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it } from 'vitest';
import { DatabaseService } from '../../../../src/database/database.service.ts';
import { ConfigService } from '@nestjs/config';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const mockConfigService = {
      get: (key: string) => {
        if (key === 'DATABASE_URL')
          return 'postgresql://mock_user:mock_password@localhost:5432/mock_db';
        return '';
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
