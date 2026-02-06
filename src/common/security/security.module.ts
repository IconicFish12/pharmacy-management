import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [AuthModule, DatabaseModule],
  exports: [AuthModule],
})
export class SecurityModule {}
