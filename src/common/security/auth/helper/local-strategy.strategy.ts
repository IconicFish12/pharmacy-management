import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthDto } from '../dto/auth.dto.js';
import { UserService } from '../../../../module/user-module/user.service.js';
import { User } from '../../../database/generated/prisma/client.js';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      session: true,
    });
  }
  async validate(payload: AuthDto): Promise<User> {
    const user = await this.userService.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
