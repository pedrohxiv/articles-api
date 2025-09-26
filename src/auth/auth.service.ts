import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prismaService.users.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }

  async register(registerDto: RegisterDto) {
    const userByEmail = await this.prismaService.users.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    const userByUsername = await this.prismaService.users.findUnique({
      where: {
        username: registerDto.username,
      },
    });

    if (userByEmail || userByUsername) {
      throw new UnprocessableEntityException();
    }

    const hashPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prismaService.users.create({
      data: {
        email: registerDto.email,
        password: hashPassword,
        username: registerDto.username,
      },
    });

    const payload = { sub: user.id };

    const token = await this.jwtService.signAsync(payload);

    return {
      email: user.email,
      username: user.username,
      token,
    };
  }
}
