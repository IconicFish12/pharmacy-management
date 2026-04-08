// import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthDto } from '../dto/auth.dto.js';
import { Employee } from '../../../database/generated/prisma/client.js';
import { AuthService } from '../auth.service.js';
import { EmployeeService } from '../../../../module/user-manage-module/employee-module/employee.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private authService: AuthService,
    private employeeService: EmployeeService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  async validate(payload: AuthDto): Promise<Employee> {
    const employee = await this.employeeService.findByEmail(payload.email);

    if (!employee) {
      throw new UnauthorizedException('user is not found');
    }

    return employee;
  }
}
