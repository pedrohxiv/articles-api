import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';
import { CreateTagDto } from '@/tag/dto/create-tag.dto';
import { UpdateTagDto } from '@/tag/dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createTagDto: CreateTagDto) {
    return this.prismaService.tags.create({
      data: {
        name: createTagDto.name,
      },
    });
  }

  async findAll() {
    const tags = await this.prismaService.tags.findMany();

    return tags.map((tag) => tag.name);
  }

  async findOne(id: string) {
    const tag = await this.prismaService.tags.findUnique({
      where: {
        id,
      },
    });

    if (!tag) {
      throw new NotFoundException();
    }

    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.prismaService.tags.findUnique({
      where: {
        id,
      },
    });

    if (!tag) {
      throw new NotFoundException();
    }

    return this.prismaService.tags.update({
      where: {
        id,
      },
      data: {
        name: updateTagDto.name,
      },
    });
  }

  async remove(id: string) {
    const tag = await this.prismaService.tags.findUnique({
      where: {
        id,
      },
    });

    if (!tag) {
      throw new NotFoundException();
    }

    return this.prismaService.tags.delete({
      where: {
        id,
      },
    });
  }
}
