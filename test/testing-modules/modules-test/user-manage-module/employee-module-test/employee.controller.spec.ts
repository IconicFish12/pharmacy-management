import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from 'src/module/user-manage-module/employee-module/employee.controller.js';
import { EmployeeService } from 'src/module/user-manage-module/employee-module/employee.service.js';

describe('EmployeeController', () => {
  let controller: EmployeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [EmployeeService],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
