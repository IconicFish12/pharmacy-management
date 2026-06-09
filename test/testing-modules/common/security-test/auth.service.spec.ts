import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it, vi } from 'vitest';
import { AuthService } from '../../../../src/module/security-module/auth/auth.service.ts';
import { EmployeeService } from '../../../../src/module/user-manage-module/employee-module/employee.service.ts';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService (Unit Testing - White Box - Auth Module)', () => {
  let service: AuthService;

  const mockEmployeeService = {
    findByEmail: vi.fn(),
    updateRefreshToken: vi.fn(),
  };

  const mockJwtService = {
    sign: vi
      .fn()
      .mockImplementation((payload) => `signed-${JSON.stringify(payload)}`),
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

  describe('login', () => {
    it('should generate tokens and return safe user profile data', async () => {
      const mockEmployee = {
        id: 'emp-123',
        name: 'John Doe',
        empId: 'EMP-012',
        email: 'johndoe@gmail.com',
        password: 'hashed-password',
        role: 'ADMIN',
        shift: 'DAY',
        status: 'ACTIVE',
        profileAvatar: 'avatar.png',
        salary: 2000000,
        startDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;

      mockEmployeeService.updateRefreshToken.mockResolvedValue(mockEmployee);

      const result = await service.login(mockEmployee);

      expect(mockEmployeeService.updateRefreshToken).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(result.user).toEqual({
        id: 'emp-123',
        name: 'John Doe',
        empId: 'EMP-012',
        email: 'johndoe@gmail.com',
        role: 'ADMIN',
        shift: 'DAY',
        status: 'ACTIVE',
        profileAvatar: 'avatar.png',
      });
      expect(result.user).not.toHaveProperty('password');
      expect(result.user).not.toHaveProperty('salary');
    });
  });
});
