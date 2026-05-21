import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import {
  JwtPayload,
  RefreshJwtPayload,
} from './interfaces/jwt-payload.interface';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'password' | 'hashPassword' | 'validatePassword'>;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  private buildAccessToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES') ?? '15m',
    });
  }

  private buildRefreshToken(user: User): string {
    const payload: RefreshJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenType: 'refresh',
    };
    return this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES') ?? '7d',
    });
  }

  async register(dto: RegisterDto): Promise<AuthTokens> {
    const user = await this.usersService.create(dto);
    return {
      accessToken: this.buildAccessToken(user),
      refreshToken: this.buildRefreshToken(user),
      user,
    };
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.usersService.findByEmail(dto.email, true);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await user.validatePassword(dto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('Account is inactive');

    return {
      accessToken: this.buildAccessToken(user),
      refreshToken: this.buildRefreshToken(user),
      user,
    };
  }

  async refresh(
    payload: RefreshJwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive) throw new UnauthorizedException();

    return {
      accessToken: this.buildAccessToken(user),
      refreshToken: this.buildRefreshToken(user),
    };
  }
}
