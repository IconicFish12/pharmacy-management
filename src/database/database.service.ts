import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private configService: ConfigService) {
    //    const adapter = new PrismaPg({
    //      database: configService.get<string>('POSTGRE_DB'),
    //      host: configService.get<string>('POSTGRE_HOST'),
    //      port: configService.get<number>('POSTGRE_PORT'),
    //      user: configService.get<string>('POSTGRE_USER'),
    //      password: configService.get<string>('POSTGRE_PASSWORD'),
    //    });
    const adapter = new PrismaPg({
      connectionString: configService.get<string>('DATABASE_URL'),
    });
    super({ adapter: adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
