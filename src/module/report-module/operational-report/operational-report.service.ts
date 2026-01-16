import { Injectable } from '@nestjs/common';
import { CreateOperationalReportDto } from './dto/create-operational-report.dto.js';
import { UpdateOperationalReportDto } from './dto/update-operational-report.dto.js';

@Injectable()
export class OperationalReportService {
  create(createOperationalReportDto: CreateOperationalReportDto) {
    return 'This action adds a new operationalReport';
  }

  findAll() {
    return `This action returns all operationalReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} operationalReport`;
  }

  update(id: number, updateOperationalReportDto: UpdateOperationalReportDto) {
    return `This action updates a #${id} operationalReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} operationalReport`;
  }
}
