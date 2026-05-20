import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from 'src/module/user-manage-module/employee-module/employee.service';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('bcrypt');

/*
jest.mock('bcrypt', () => {
    return {
        __esModule: true,
        hash: jest.fn(),
    }
})
*/
jest.mock('fs', () => {
    return {
        __esModule: true,
        existsSync: jest.fn(),
        unlinkSync: jest.fn(),
    }
})

jest.mock('path', () => {
    return {
        __esModule: true,
        join: jest.fn(),
    }
})

// shared object 
const employeeId = '';
const employeeEmpId = '';
const employeeEmail = '';

const mockEmployeeData = [];

const mockCreateDto = {};

const mockUpdateDto = {};

const mockFile: Express.multer.file = {}

describe('EmployeeService', () => {
  let service: EmployeeService;
  let database: DatabaseService;

  const mockDatabase = {
      employee: {
         create: jest.fn(),
         findMany: jest.fn(),
         findUnique: jest.fn(),
         count: jest.fn(),
         update: jest.fn(),
         delete: jest.fn(),
      }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          EmployeeService,
          {
              provide: DatabaseService,
              useValue: mockDatabase,
          }
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    database = module.get<DatabaseService>(DatabaseService);

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
  });

  afterEach(() => {
      jest.clearAllMocks();
  });

  // Service Defined
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
      expect(mockDatabase.employee).toBeDefined();
  })

  describe('Function create testing', () => {
      
  })
});

