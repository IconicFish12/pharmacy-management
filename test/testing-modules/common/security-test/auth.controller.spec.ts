import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it, vi } from 'vitest';
import { AuthController } from '../../../../src/module/security-module/auth/auth.controller.ts';
import { AuthService } from '../../../../src/module/security-module/auth/auth.service.ts';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: vi.fn(),
    refreshTokens: vi.fn(),
    clearRefreshToken: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login and return access token and safe user profile details', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        empId: 'EMP-012',
        email: 'johndoe@gmail.com',
        role: 'ADMIN',
        shift: 'DAY',
        status: 'ACTIVE',
        profileAvatar: 'avatar.png',
        password: 'hashed-password',
        salary: 3000000,
      };

      const mockTokens = {
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123',
        user: {
          id: 'user-123',
          name: 'John Doe',
          empId: 'EMP-012',
          email: 'johndoe@gmail.com',
          role: 'ADMIN',
          shift: 'DAY',
          status: 'ACTIVE',
          profileAvatar: 'avatar.png',
        },
      };

      mockAuthService.login.mockResolvedValue(mockTokens);

      const mockRes = {
        cookie: vi.fn(),
      } as any;

      const result = await controller.login(
        { email: 'johndoe@gmail.com', password: 'password' },
        { user: mockUser },
        mockRes,
      );

      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
      expect(mockRes.cookie).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken', 'access-token-123');
      expect(result).toHaveProperty('user');
      expect(result.user).toEqual({
        id: 'user-123',
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

  describe('getProfile', () => {
    it('should return safe profile details of logged in user', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        empId: 'EMP-012',
        email: 'johndoe@gmail.com',
        role: 'ADMIN',
        shift: 'DAY',
        status: 'ACTIVE',
        profileAvatar: 'avatar.png',
        password: 'hashed-password',
        salary: 3000000,
      };

      const result = await controller.getProfile({ user: mockUser });

      expect(result).toEqual({
        id: 'user-123',
        name: 'John Doe',
        empId: 'EMP-012',
        email: 'johndoe@gmail.com',
        role: 'ADMIN',
        shift: 'DAY',
        status: 'ACTIVE',
        profileAvatar: 'avatar.png',
      });
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('salary');
    });
  });
});
