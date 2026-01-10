import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionModuleService } from './transaction-module.service';
import { CreateTransactionModuleDto } from './dto/create-transaction-module.dto';
import { UpdateTransactionModuleDto } from './dto/update-transaction-module.dto';

@Controller('transaction-module')
export class TransactionModuleController {
  constructor(
    private readonly transactionModuleService: TransactionModuleService,
  ) {}

  @Post()
  create(@Body() createTransactionModuleDto: CreateTransactionModuleDto) {
    return this.transactionModuleService.create(createTransactionModuleDto);
  }

  @Get()
  findAll() {
    return this.transactionModuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionModuleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionModuleDto: UpdateTransactionModuleDto,
  ) {
    return this.transactionModuleService.update(id, updateTransactionModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionModuleService.remove(id);
  }
}
