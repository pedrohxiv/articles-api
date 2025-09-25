import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { SignInDto } from '@/auth/dto/sign-in.dto';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.prismaService.users.findUnique({
      where: {
        email: signInDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const passwordMatch = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
