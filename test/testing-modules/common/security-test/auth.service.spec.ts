import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it, vi } from 'vitest';
import { AuthService } from '../../../../src/module/security-module/auth/auth.service.ts';
import { EmployeeService } from '../../../../src/module/user-manage-module/employee-module/employee.service.ts';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  const mockEmployeeService = {
    findByEmail: vi.fn(),
  };

  const mockJwtService = {
    sign: vi.fn(),
  };

  const mockConfigService = {
    get: vi.fn().mockReturnValue('mock_secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
