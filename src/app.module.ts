import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import Joi from 'joi';
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
import { ReportMainModule } from './module/report-module/report-main.module.js';
import { FinancialReportModule } from './module/report-module/financial-report/financial-report.module.js';
import { OperationalReportModule } from './module/report-module/operational-report/operational-report.module.js';

@Module({
  imports: [
    HelperModule,
    MainAppModule,
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN: Joi.string().required(),
        BACKEND_PORT: Joi.number().default(5000),
        THROTTLE_TTL: Joi.number().required(),
        THROTTLE_LIMIT: Joi.number().required(),
        MAIL_HOST: Joi.string().optional(),
        MAIL_PORT: Joi.number().optional(),
        MAIL_USERNAME: Joi.string().optional(),
        MAIL_PASSWORD: Joi.string().allow('').optional(),
        MAIL_FROM: Joi.string().optional(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
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
          {
            path: 'reports',
            module: ReportMainModule,
            children: [
              {
                path: 'operational-report',
                module: OperationalReportModule,
              },
              {
                path: 'transaction-details',
                module: FinancialReportModule,
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
