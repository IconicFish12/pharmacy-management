import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Employee } from '../../../database/generated/prisma/client.js';
import * as bcrypt from 'bcrypt';
import { EmployeeService } from '../../../module/user-manage-module/employee-module/employee.service.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly employeeService: EmployeeService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Employee | null> {
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

  async login(employee: Employee) {
    const payload = {
      email: employee.email,
      sub: employee.id,
      role: employee.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      expiresIn: '7d',
    });

    const saltRounds = 10;
    const hashedToken = await bcrypt.hash(refreshToken, saltRounds);
    await this.employeeService.updateRefreshToken(employee.id, hashedToken);

    const { id, name, empId, email, role, shift, status, profileAvatar } =
      employee;

    return {
      accessToken,
      refreshToken,
      user: {
        id,
        name,
        empId,
        email,
        role,
        shift,
        status,
        profileAvatar,
      },
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      });

      const employee = await this.employeeService.findOne(payload.sub);
      if (!employee || !employee.refreshToken) {
        throw new UnauthorizedException('Access Denied');
      }

      const isMatch = await bcrypt.compare(refreshToken, employee.refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Access Denied');
      }

      const newPayload = {
        email: employee.email,
        sub: employee.id,
        role: employee.role,
      };

      const accessToken = this.jwtService.sign(newPayload);
      return { accessToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async clearRefreshToken(id: string) {
    await this.employeeService.updateRefreshToken(id, null);
  }
}
