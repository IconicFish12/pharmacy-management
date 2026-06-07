import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../../common/guards/roles.decorator.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { Role } from '../../../database/generated/prisma/enums.js';

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.OWNER, Role.ADMIN)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UseInterceptors(FileInterceptor('profileAvatar'))
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.employeeService.create(createEmployeeDto, file!);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('perPage') perPage?: number) {
    return this.employeeService.findAll(page!, perPage!);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.employeeService.update(id, updateEmployeeDto, file!);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
