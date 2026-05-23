import { Test, TestingModule } from '@nestjs/testing';
import { vi, beforeEach, afterEach, expect, describe, it } from 'vitest';
import { EmployeeService } from '../../../../../src/module/user-manage-module/employee-module/employee.service.ts';
import { DatabaseService } from '../../../../../src/database/database.service.ts';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

// Mocked Libraries
const mockBcrypt = vi.hoisted(() => {
  return { hash: vi.fn() };
});

const mockFs = vi.hoisted(() => {
  return {
    existsSync: vi.fn(),
    unlinkSync: vi.fn(),
  };
});

const mockPath = vi.hoisted(() => {
  return {
    join: vi.fn(),
  };
});

vi.mock('bcrypt', () => {
  return {
    hash: mockBcrypt.hash,
  };
});

vi.mock('fs', () => {
  return {
    existsSync: mockFs.existsSync,
    unlinkSync: mockFs.unlinkSync,
  };
});

vi.mock('path', () => {
  return {
    join: mockPath.join,
  };
});

// shared object
const employeeId = '6342b862-674e-4d86-8627-10729be1d4ac';
const employeeEmpId = 'EMP-011';
const employeeEmail = 'subhanmaulaana9871@gmail.con';

const mockEmployeeData = [
  {
    id: '6342b862-674e-4d86-8627-10729be1d4ac',
    name: 'Ibnu Syawal Aliefian',
    empId: 'EMP-001',
    email: 'ibnusyawalaliefian16@gmail.com',
    password: '',
    phoneNumber: '082162941198',
    role: 'OWNEE',
    shift: 'DAY',
    status: 'ACTIVE',
    dateOfBirth: null,
    alamat: null,
    profileAvatar: null,
    salary: 2000000,
    startDate: new Date('2022-09-08'),
    createdAt: new Date('2026-05-21T19:38:00.000Z'),
    updatedAt: new Date('2026-05-21T19:38:00.000Z'),
  },
  {
    id: 'e0165493-8da7-45ed-90a3-8657bb13d4c1',
    name: 'I Made wirawan',
    empId: 'EMP-002',
    email: 'gustimadewairwan@gmail.com',
    password: '',
    phoneNumber: '085177613521',
    role: 'ADMIN',
    shift: 'EVENING',
    status: 'ACTIVE',
    dateOfBirth: null,
    alamat: null,
    profileAvatar: null,
    salary: 2000000,
    startDate: new Date('2022-09-08'),
    createdAt: new Date('2026-05-21T19:38:00.000Z'),
    updatedAt: new Date('2026-05-21T19:38:00.000Z'),
  },
  {
    id: 'e6d9a1bd-22a8-4397-b8eb-6da21cdb2dfa',
    name: 'Ibnu Syawal Aliefian',
    empId: 'EMP-001',
    email: 'ibnusyawalaliefian16@gmail.com',
    password: '',
    phoneNumber: '087188213314',
    role: 'PHARMACIST',
    shift: 'NIGHT',
    status: 'ACTIVE',
    dateOfBirth: null,
    alamat: null,
    profileAvatar: null,
    salary: 2000000,
    startDate: new Date('2022-09-08'),
    createdAt: new Date('2026-05-21T19:38:00.000Z'),
    updatedAt: new Date('2026-05-21T19:38:00.000Z'),
  },
];

const mockCreateDto = {
  name: 'John Doe',
  empId: 'EMP-012',
  email: 'johndoe091@gmail.com',
  password: 'JohnDoe-123',
  role: 'ADMIN',
  shift: 'DAY',
  status: 'INACTIVE',
  salary: 2500000,
  startDate: new Date('2026-07-09'),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUpdateDto = {
  name: 'John Doe',
  empId: 'EMP-012',
  email: 'johndoe091@gmail.com',
  password: 'JohnDoe-123',
  role: 'ADMIN',
  shift: 'DAY',
  status: 'ACTIVE',
  salary: 2500000,
  startDate: new Date('2026-07-09'),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockFile = {
  fieldname: 'image',
  originalname: 'profile-picture.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from('dummy-image-content'),
  size: 20480,
  destination: './src/common/helpers/upload/images/',
  filename: '1716342132-profile-picture.jpg',
  path: './src/common/helpers/upload/images/1716342132-profile-picture.jpg',
} as Express.Multer.File;

describe('EmployeeService - Unit testing (White Box testing)', () => {
  let service: EmployeeService;
  let database: DatabaseService;

  const mockDatabase = {
    employee: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: DatabaseService,
          useValue: mockDatabase,
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    database = module.get<DatabaseService>(DatabaseService);

    vi.mocked(bcrypt.hash).mockResolvedValue(mockCreateDto.password);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Service Defined
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(mockDatabase.employee).toBeDefined();
  });

  // service function unit testing
  describe('Function create testing', () => {
    it('should been created a employee data without file (provile avatar)', async () => {
      mockDatabase.employee.create.mockResolvedValue({
        id: 'f294d18a-34c1-4b68-be19-9bd6d42cc06b',
        ...mockCreateDto,
      });

      const result = await service.create(mockCreateDto);
      const hash = await bcrypt.hash(mockCreateDto.password);

      expect(mockDatabase.employee.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateDto,
          password: hash,
        },
      });

      expect(bcrypt.hash).toHaveBeenCalledWith(mockCreateDto.password, 10);
      expect(result).toHaveProperty(
        'id',
        'f294d18a-34c1-4b68-be19-9bd6d42cc06b',
      );
    });

    it('should been created a employee data with file (profile avatar)', async () => {
      mockDatabase.employee.create.mockResolvedValue({
        id: 'f294d18a-34c1-4b68-be19-9bd6d42cc06b',
        ...mockCreateDto,
        profileAvatar: mockFile.filename,
      });

      const result = await service.create(mockCreateDto, mockFile);
      const hash = await bcrypt.hash(mockCreateDto.password, 10);

      expect(mockDatabase.employee.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateDto,
          password: hash,
          profileAvatar: mockFile.filename,
        },
      });

      expect(bcrypt.hash).toHaveBeenCalledWith(mockCreateDto.password, 10);
      expect(result).toHaveProperty(
        'id',
        'f294d18a-34c1-4b68-be19-9bd6d42cc06b',
      );
      expect(result).toHaveProperty('profileAvatar', mockFile.filename);
    });

    it('Should throw error if bcrypt hashing fails', async () => {
      vi.mocked(bcrypt.hash).mockRejectedValue(
        new Error('Bcrypt Error') as never,
      );

      await expect(service.create(mockCreateDto)).rejects.toThrow(
        'Bcrypt Error',
      );

      expect(mockDatabase.employee.create).not.toHaveBeenCalled();
    });
  });

  describe('Function findAll testing', () => {
    it('should shows and returns employees data ', async () => {
      mockDatabase.employee.findMany.mockResolvedValue(mockEmployeeData);
      mockDatabase.employee.count.mockResolvedValue(3);

      const result = await service.findAll(1, 10);

      expect(mockDatabase.employee.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
          take: 10,
          skip: 0,
        }),
      );

      expect(mockDatabase.employee.count).toHaveBeenCalled();
      expect(result.data).toEqual(mockEmployeeData);
      expect(result.data).toHaveLength(3);
      expect(result.meta.total).toBe(3);
      expect(result.data[0].name).toBe('Ibnu Syawal Aliefian');
    });
  });

  describe('Function findOne testing', () => {
    it('should return employee data with relations when found', async () => {
      const mockEmployeeWithRelation = {
        ...mockEmployeeData[0],
        _count: { medicineOrders: 0, transactions: 0 },
        medicineOrders: [],
        transactions: [],
      };
      mockDatabase.employee.findUnique.mockResolvedValue(
        mockEmployeeWithRelation,
      );

      const result = await service.findOne(employeeId);

      expect(mockDatabase.employee.findUnique).toHaveBeenCalledWith({
        where: { id: employeeId },
        include: {
          _count: true,
          medicineOrders: true,
          transactions: true,
        },
      });
      expect(result).toEqual(mockEmployeeWithRelation);
    });

    it('should throw NotFoundException when employee is not found', async () => {
      mockDatabase.employee.findUnique.mockResolvedValue(null);

      await expect(service.findOne(employeeId)).rejects.toThrow(
        new NotFoundException(`employee with ID ${employeeId} not found`),
      );
    });
  });

  describe('Function update testing', () => {
    it('should throw NotFoundException if employee data is not found', async () => {
      mockDatabase.employee.findUnique.mockResolvedValue(null);

      await expect(service.update(employeeId, mockUpdateDto)).rejects.toThrow(
        new NotFoundException(`Employee with ID ${employeeId} not found`),
      );
    });

    it('should throw NotFoundException if employee data is not found and delete uploaded file', async () => {
      mockDatabase.employee.findUnique.mockResolvedValue(null);
      vi.mocked(fs.unlinkSync).mockReturnValue(undefined);

      await expect(
        service.update(employeeId, mockUpdateDto, mockFile),
      ).rejects.toThrow(
        new NotFoundException(`Employee with ID ${employeeId} not found`),
      );

      expect(mockFs.unlinkSync).toHaveBeenCalledWith(mockFile.path);
    });

    it('should update employee data successfully without uploading a new file', async () => {
      const existingEmployee = mockEmployeeData[0];
      mockDatabase.employee.findUnique.mockResolvedValue(existingEmployee);
      mockDatabase.employee.update.mockResolvedValue({
        ...existingEmployee,
        ...mockUpdateDto,
      });

      const hash = await bcrypt.hash(mockUpdateDto.password, 10);

      const result = await service.update(employeeId, mockUpdateDto);

      expect(mockDatabase.employee.update).toHaveBeenCalledWith({
        where: { id: employeeId },
        data: {
          ...mockUpdateDto,
          password: hash,
        },
      });
      expect(result.status).toBe('ACTIVE');
    });

    it('should delete old avatar file and update employee with new avatar file', async () => {
      const existingEmployee = {
        ...mockEmployeeData[0],
        profileAvatar: 'old-avatar.jpg',
      };
      mockDatabase.employee.findUnique.mockResolvedValue(existingEmployee);

      mockPath.join.mockReturnValue('./uploads/images/old-avatar.jpg');
      mockFs.existsSync.mockReturnValue(true);
      mockFs.unlinkSync.mockReturnValue(undefined);

      mockDatabase.employee.update.mockResolvedValue({
        ...existingEmployee,
        ...mockUpdateDto,
        profileAvatar: mockFile.filename,
      });

      const hash = await bcrypt.hash(mockUpdateDto.password, 10);
      const result = await service.update(employeeId, mockUpdateDto, mockFile);

      expect(mockPath.join).toHaveBeenCalledWith(
        './uploads/images',
        'old-avatar.jpg',
      );
      expect(mockFs.unlinkSync).toHaveBeenCalledWith(
        './uploads/images/old-avatar.jpg',
      );
      expect(mockDatabase.employee.update).toHaveBeenCalledWith({
        where: { id: employeeId },
        data: {
          ...mockUpdateDto,
          password: hash,
          profileAvatar: mockFile.filename,
        },
      });
      expect(result.profileAvatar).toBe(mockFile.filename);
    });
  });

  describe('Function remove testing', () => {
    it('should delete employee data successfully from database', async () => {
      const deletedEmployee = mockEmployeeData[0];
      mockDatabase.employee.delete.mockResolvedValue(deletedEmployee);

      const result = await service.remove(employeeId);

      expect(mockDatabase.employee.delete).toHaveBeenCalledWith({
        where: { id: employeeId },
      });
      expect(result).toEqual(deletedEmployee);
    });
  });

  describe('Function findByEmail testing', () => {
    it('should return employee data matching the requested email', async () => {
      const expectedEmployee = mockEmployeeData[0];
      mockDatabase.employee.findFirst.mockResolvedValue(expectedEmployee);

      const result = await service.findByEmail(employeeEmail);

      expect(mockDatabase.employee.findFirst).toHaveBeenCalledWith({
        where: { email: employeeEmail },
      });
      expect(result).toEqual(expectedEmployee);
    });

    it('should return null if no employee matches the email', async () => {
      mockDatabase.employee.findFirst.mockResolvedValue(null);

      const result = await service.findByEmail('unknown@mail.com');

      expect(result).toBeNull();
    });
  });
});
