import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { DatabaseModule } from '../../common/database/database.module.js';
import { DatabaseService } from '../../common/database/database.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, DatabaseService],
})
export class UserModule {}
