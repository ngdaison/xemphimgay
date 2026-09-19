import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { loginSchema, registerSchema } from '@webtruyenphim/validation';
import { z } from 'zod';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(data: z.infer<typeof registerSchema>) {
    const existingUser = await this.userService.findOne(data.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await argon2.hash(data.password);

    const user = await this.userService.create({
      email: data.email,
      username: data.username,
      passwordHash,
      displayName: data.displayName,
      role: { connect: { name: 'user' } },
    });

    return this.generateTokens(user.id, user.email);
  }

  async login(data: z.infer<typeof loginSchema>) {
    const user = await this.userService.findOne(data.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, data.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email);
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      return this.generateTokens(payload.sub, payload.email);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    return { access_token, refresh_token };
  }
}
