import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserModule } from '../../../module/user-module/user.module.js';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from '../../../module/user-module/user.service.js';
import { LocalStrategy } from './helper/local-strategy.strategy.js';
import { JwtStrategy } from './helper/jwt-strategy.strategy.js';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET as string,
      global: true,
      signOptions: { expiresIn: '60s' },
      // verifyOptions: {  },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, UserService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
