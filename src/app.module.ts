import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { MainAppModule } from './module/main-app.module';
import { SecurityModule } from './common/security/security.module';
import { HelperModule } from './common/helpers/helper.module';

@Module({
  imports: [
    HelperModule,
    SecurityModule,
    MainAppModule,
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    RouterModule.register([]),
    MailerModule.forRootAsync({}),
    MulterModule.registerAsync({}),
    ThrottlerModule.forRootAsync({}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
