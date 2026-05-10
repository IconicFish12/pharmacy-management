import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module.js';
import { MainAppModule } from './module/main-app.module.js';
import { HelperModule } from './common/helpers/helper.module.js';
import { MedicineMainModule } from './module/medicine-module/medicine-main.module.js';
import { MedicineModule } from './module/medicine-module/medicine/medicine.module.js';
import { MedicineCategoryModule } from './module/medicine-module/medicine-category/medicine-category.module.js';
import { MedicineOrderModule } from './module/medicine-module/medicine-order/medicine-order.module.js';
import { ActivityLogModule } from './module/logs-module/activity-log.module.js';
import { AuthModule } from './module/security-module/auth/auth.module.js';
import { OrderDetailModule } from './module/medicine-module/medicine-order/order-detail/order-detail.module.js';
import { TransactionModule } from './module/transaction-module/transaction.module.js';
import { TransactionDetailModule } from './module/transaction-module/transaction-detail/transaction-detail.module.js';
import { AppController } from './app.controller.js';
import { EmployeeModule } from './module/user-manage-module/employee-module/employee.module.js';
import { SupplierModule } from './module/user-manage-module/supplier-module/supplier.module.js';

@Module({
  imports: [
    HelperModule,
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
            path: 'auth',
            module: AuthModule,
          },
          {
            path: 'medicine-data',
            module: MedicineMainModule,
            children: [
              {
                path: 'medicines',
                module: MedicineModule,
              },
              {
                path: 'medicine-categories',
                module: MedicineCategoryModule,
              },
            ],
          },
          {
            path: 'suppliers',
            module: SupplierModule,
          },
          {
            path: 'employees',
            module: EmployeeModule,
          },
          {
            path: 'activity-logs',
            module: ActivityLogModule,
          },
          {
            path: 'finances',
            children: [
              {
                path: 'medicine-orders',
                module: MedicineOrderModule,
              },
              {
                path: 'order-details',
                module: OrderDetailModule,
              },
              {
                path: 'transactions',
                module: TransactionModule,
              },
              {
                path: 'transaction-details',
                module: TransactionDetailModule,
              },
            ],
          },
        ],
      },
    ]),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL') as number,
          limit: config.get<number>('THROTTLE_LIMIT') as number,
          setHeaders: true,
        },
      ],
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
  controllers: [AppController],
})
export class AppModule {}
