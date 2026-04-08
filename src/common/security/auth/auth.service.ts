import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Employee } from '../../database/generated/prisma/client.js';
import * as bcrypt from 'bcrypt';
import { EmployeeService } from '../../../module/user-manage-module/employee-module/employee.service.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly employeeService: EmployeeService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Employee | null> {
    const employee = await this.employeeService.findByEmail(email);
    if (!employee) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return null;
    }
    return employee;
  }

  login(employee: Employee) {
    const payload = { email: employee.email, sub: employee.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
