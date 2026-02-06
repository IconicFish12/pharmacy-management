/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from './dto/auth.dto.js';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  login(@Body() authDto: AuthDto, @Request() req: any) {
    // Passport menyimpan hasil validate() ke dalam req.user
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('sign-out')
  logout(@Request() req: any) {
    return req.logout();
  }
}
