import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth.module.js';
import { JwtStrategy } from './jwt-strategy.strategy.js';
import { LocalStrategy } from './local-strategy.strategy.js';
import { UserModule } from '../../../../module/user-module/user.module.js';

@Module({
  imports: [forwardRef(() => AuthModule), UserModule],
  providers: [JwtStrategy, LocalStrategy],
})
export class AuthHelperModule {}
