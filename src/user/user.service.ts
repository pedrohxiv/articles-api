import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';
import { UpdateUserDto } from '@/user/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const users = await this.prismaService.users.findMany({
      omit: {
        password: true,
      },
    });

    return users;
  }

  async findById(id: string) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.prismaService.users.findUnique({
      where: {
        username,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return this.prismaService.users.update({
      where: {
        id,
      },
      data: updateUserDto,
      omit: {
        password: true,
      },
    });
  }

  async remove(id: string) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return this.prismaService.users.delete({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });
  }
}
