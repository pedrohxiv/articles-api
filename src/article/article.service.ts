import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateArticleDto } from '@/article/dto/create-article.dto';
import { UpdateArticleDto } from '@/article/dto/update-article.dto';
import { PrismaService } from '@/database/prisma.service';
import { generateSlug } from '@/utils/slugify.util';

@Injectable()
export class ArticleService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createArticleDto: CreateArticleDto, ownerId: string) {
    let tagIDs: string[] = [];

    if (createArticleDto.tagList && createArticleDto.tagList.length > 0) {
      const tags = await this.prismaService.tags.findMany({
        where: {
          name: { in: createArticleDto.tagList },
        },
      });

      if (tags.length !== createArticleDto.tagList.length) {
        throw new BadRequestException();
      }

      tagIDs = tags.map((tag) => tag.id);
    }

    return this.prismaService.articles.create({
      data: {
        slug: generateSlug(createArticleDto.title),
        title: createArticleDto.title,
        description: createArticleDto.description,
        body: createArticleDto.body,
        favoritesCount: 0,
        authorId: ownerId,
        tagIDs,
      },
    });
  }

  findAll() {
    return `This action returns all article`;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
