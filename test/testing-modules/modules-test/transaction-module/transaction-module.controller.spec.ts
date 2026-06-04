import { Test, TestingModule } from '@nestjs/testing';
import { vi, beforeEach, afterEach, expect, describe, it } from 'vitest';
import { TransactionController } from '../../../../src/module/transaction-module/transaction.controller.ts';
import { TransactionService } from '../../../../src/module/transaction-module/transaction.service.ts';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../../src/common/guards/roles.guard.ts';

describe('TransactionController (Integration Testing - Gray Box)', () => {
  let controller: TransactionController;
  let service: TransactionService;

  const mockTransactionService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /', () => {
    it('should forward data to TransactionService.create', async () => {
      const dto = {
        transactionDate: new Date(),
        cashReceived: 100000,
        employeeId: 'emp-uuid',
        medicines: [{ medicineId: 'med-123', quantity: 2 }],
      };
      const mockResult = { id: 't-123', totalPrice: 60000 };
      mockTransactionService.create.mockResolvedValue(mockResult);

      const result = await controller.create(dto, 'emp-uuid');

      expect(service.create).toHaveBeenCalledWith(dto, 'emp-uuid');
      expect(result).toEqual(mockResult);
    });
  });

  describe('GET /', () => {
    it('should forward parameters to TransactionService.findAll', async () => {
      mockTransactionService.findAll.mockResolvedValue({ data: [], meta: {} });
      const result = await controller.findAll(1, 10);
      expect(service.findAll).toHaveBeenCalledWith(10, 1);
      expect(result).toEqual({ data: [], meta: {} });
    });
  });

  describe('GET /:id', () => {
    it('should forward parameter to TransactionService.findOne', async () => {
      const mockResult = { id: 't-123', transactionCode: 'TRC-123' };
      mockTransactionService.findOne.mockResolvedValue(mockResult);
      const result = await controller.findOne('t-123');
      expect(service.findOne).toHaveBeenCalledWith('t-123');
      expect(result).toEqual(mockResult);
    });
  });

  describe('PATCH /:id', () => {
    it('should forward parameter and dto to TransactionService.update', async () => {
      const updateDto = { totalPrice: 55000 };
      const mockResult = { id: 't-123', totalPrice: 55000 };
      mockTransactionService.update.mockResolvedValue(mockResult);
      const result = await controller.update('t-123', updateDto as any);
      expect(service.update).toHaveBeenCalledWith('t-123', updateDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('DELETE /:id', () => {
    it('should call service remove with id', async () => {
      const mockResult = { id: 't-123' };
      mockTransactionService.remove.mockResolvedValue(mockResult);
      const result = await controller.remove('t-123');
      expect(service.remove).toHaveBeenCalledWith('t-123');
      expect(result).toEqual(mockResult);
    });
  });
});
