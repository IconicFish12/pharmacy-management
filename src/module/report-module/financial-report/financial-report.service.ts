import { Injectable } from '@nestjs/common';
import { CreateFinancialReportDto } from './dto/create-financial-report.dto';
import { UpdateFinancialReportDto } from './dto/update-financial-report.dto';

@Injectable()
export class FinancialReportService {
  create(createFinancialReportDto: CreateFinancialReportDto) {
    return 'This action adds a new financialReport';
  }

  findAll() {
    return `This action returns all financialReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} financialReport`;
  }

  update(id: number, updateFinancialReportDto: UpdateFinancialReportDto) {
    return `This action updates a #${id} financialReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} financialReport`;
  }
}
