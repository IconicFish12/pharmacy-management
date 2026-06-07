import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it, vi } from 'vitest';
import { AuthController } from '../../../../src/module/security-module/auth/auth.controller.ts';
import { AuthService } from '../../../../src/module/security-module/auth/auth.service.ts';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: vi.fn(),
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
});
