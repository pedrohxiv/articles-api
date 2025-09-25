import { Injectable } from '@nestjs/common';

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

  findOne(id: string) {
    return this.prismaService.tags.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, updateTagDto: UpdateTagDto) {
    return this.prismaService.tags.update({
      where: {
        id,
      },
      data: {
        name: updateTagDto.name,
      },
    });
  }

  remove(id: string) {
    return this.prismaService.tags.delete({
      where: {
        id,
      },
    });
  }
}
