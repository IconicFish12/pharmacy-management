import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MedicineOrderService } from 'src/module/medicine-module/medicine-order/medicine-order.service';
import { DatabaseService } from 'src/database/database.service';

const mockDatabase = {
  $transcation: jest.fn().mockImplementation((callback) => {
    return callback(mockDatabase);
  }),
  medicineOrder: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  medicine: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const mockEvent = {
  emit: jest.fn(),
};

describe('MedicineOrderService', () => {
  let service: MedicineOrderService;
  let database: DatabaseService;
  let event: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicineOrderService,
        {
          provide: DatabaseService,
          useValue: mockDatabase,
        },
        {
          provide: EventEmitter2,
          useValue: mockEvent,
        },
      ],
    }).compile();

    service = module.get<MedicineOrderService>(MedicineOrderService);
    database = module.get<DatabaseService>(DatabaseService);
    event = module.get<EventEmitter2>(EventEmitter2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /* Issue #1 A1 and A2 must been fixed ASAP
   * issue accurred in creating medicine order data
  describe('Function create testing', () => {
      it('should succeed creating medicine order data', async () => {

      });

      it('should return NotFoundException when medicine data is not found', async () => {

      });

      it('should trigger event and shown logs if detects low stock medicine', async () => {
          
      });

      it('should return BadRequestException when money received is ')

  });

  */

  describe('Function findAll testing', () => {});

  describe('Function findOne testing', () => {});

  describe('Function update testing', () => {});

  describe('Function delete testing', () => {});
});
