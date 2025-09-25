import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from '@/auth/auth.service';
import { PrismaService } from '@/database/prisma.service';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prismaService.users.create({
      data: {
        email: createUserDto.email,
        password: hashPassword,
        username: createUserDto.username,
      },
    });

    const login = await this.authService.signIn({
      email: user.email,
      password: createUserDto.password,
    });

    return {
      email: user.email,
      username: user.username,
      token: login.token,
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
