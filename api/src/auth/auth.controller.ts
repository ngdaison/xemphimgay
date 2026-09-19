import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { loginSchema, registerSchema } from '@webtruyenphim/validation';
import { z } from 'zod';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  async register(@Body() body: any) {
    const data = registerSchema.parse(body);
    return this.authService.register(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() body: any) {
    const data = loginSchema.parse(body);
    return this.authService.login(data);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() body: { refresh_token: string }) {
    if (!body.refresh_token) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshToken(body.refresh_token);
  }
}
