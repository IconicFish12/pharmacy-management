import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { DatabaseModule } from './common/database/database.module.js';
import { MainAppModule } from './module/main-app.module.js';
import { SecurityModule } from './common/security/security.module.js';
import { HelperModule } from './common/helpers/helper.module.js';
import { MedicineMainModule } from './module/medicine-module/medicine-main.module.js';
import { MedicineModule } from './module/medicine-module/medicine/medicine.module.js';
import { MedicineCategoryModule } from './module/medicine-module/medicine-category/medicine-category.module.js';
import { MedicineOrderModule } from './module/medicine-module/medicine-order/medicine-order.module.js';
import { SupplierModule } from './module/supplier-module/supplier.module.js';
import { UserModule } from './module/user-module/user.module.js';

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
    RouterModule.register([
      {
        path: 'api', 
        module: MainAppModule, 
        children: [
          {
            path: 'medicine-data',
            module: MedicineMainModule,
            children: [
              {
                path: 'medicines',
                module: MedicineModule
              }, 
              {
                path: 'medicine-categories',
                module: MedicineCategoryModule
              }, 
              {
                path: 'medicine-orders',
                module: MedicineOrderModule,
              }
            ],
          },
          {
            path: 'suppliers',
            module: SupplierModule
          },
          {
            path: 'users',
            module: UserModule
          }
        ]
      }
    ]),
    // MailerModule.forRootAsync({}),
    // MulterModule.registerAsync({}),
    // ThrottlerModule.forRootAsync({}),
  ],
})
export class AppModule {}
