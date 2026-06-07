import {
  Body,
  Controller,
  Logger,
  Post,
  Request,
  UseGuards,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from './dto/auth.dto.js';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Throttle({ default: { limit: 5, ttl: 300000 } })
  @Post('sign-in')
  async login(
    @Body() authDto: AuthDto,
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @Post('refresh')
  async refresh(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookieHeader = req.headers?.cookie;
    const refreshToken = cookieHeader
      ?.split(';')
      .find((c) => c.trim().startsWith('refreshToken='))
      ?.split('=')[1];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const { accessToken } = await this.authService.refreshTokens(refreshToken);
    return { accessToken };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sign-out')
  async logout(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    if (req.user) {
      await this.authService.clearRefreshToken(req.user.id);
    }
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }
}
