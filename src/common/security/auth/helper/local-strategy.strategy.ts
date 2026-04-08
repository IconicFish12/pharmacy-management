import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Employee } from '../../../database/generated/prisma/client.js';
import { AuthService } from '../auth.service.js';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    });
  }
  async validate(email: string, password: string): Promise<Employee> {
    const employee = await this.authService.validateUser(email, password);

    if (!employee) {
      throw new UnauthorizedException('credential is not valid');
    }

    return employee;
  }
}
