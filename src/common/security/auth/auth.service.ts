import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../../../module/user-module/user.service.js';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './helper/local-strategy.strategy.js';
import { User } from '../../database/generated/prisma/client.js';
import { AuthDto } from './dto/auth.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private localStrategy: LocalStrategy,
  ) {}

  async validateUser(authRequest: AuthDto): Promise<User | null> {
    const user = await this.userService.findByEmail(authRequest.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(
      authRequest.password,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  login(authRequest: AuthDto) {
    const tokenAccess = this.jwtService.sign(authRequest);
    return {
      access_token: tokenAccess,
    };
  }
}
