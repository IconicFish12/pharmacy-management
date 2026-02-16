import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
// import { PrismaNeon } from '@prisma/adapter-neon';
import { env } from 'prisma/config';
import { PrismaClient } from './generated/prisma/client.js';
@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: env('DATABASE_URL_LOCAL'),
    });
    // const adapter = new PrismaNeon({
    //   application_name: 'pharma-ease',
    //   connectionString: env('DATABASE_URL_NEON'),
    // });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
