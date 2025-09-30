import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

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

    const slug = generateSlug(createArticleDto.title);

    const article = await this.prismaService.articles.findUnique({
      where: {
        slug,
      },
    });

    if (article) {
      throw new ConflictException();
    }

    return this.prismaService.articles.create({
      data: {
        slug,
        title: createArticleDto.title,
        description: createArticleDto.description,
        body: createArticleDto.body,
        favoritesCount: 0,
        authorId: ownerId,
        tagIDs,
      },
    });
  }

  async findAll() {
    const articles = await this.prismaService.articles.findMany({
      include: {
        author: {
          select: {
            username: true,
            bio: true,
            image: true,
          },
        },
        tags: true,
      },
      omit: {
        tagIDs: true,
      },
    });

    return articles.map((article) => ({
      ...article,
      tags: article.tags.map((tag) => tag.name),
    }));
  }

  async findOne(param: string) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(param);

    const article = await this.prismaService.articles.findUnique({
      where: isObjectId ? { id: param } : { slug: param },
      include: {
        author: {
          select: {
            username: true,
            bio: true,
            image: true,
          },
        },
        tags: true,
      },
      omit: {
        tagIDs: true,
      },
    });

    if (!article) {
      throw new NotFoundException();
    }

    return {
      ...article,
      tags: article.tags.map((tag) => tag.name),
    };
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    ownerId: string,
  ) {
    const article = await this.prismaService.articles.findUnique({
      where: {
        id,
      },
    });

    if (!article) {
      throw new NotFoundException();
    }

    if (article.authorId !== ownerId) {
      throw new UnauthorizedException();
    }

    let tagIDs: string[] = [];

    if (updateArticleDto.tagList && updateArticleDto.tagList.length > 0) {
      const tags = await this.prismaService.tags.findMany({
        where: {
          name: { in: updateArticleDto.tagList },
        },
      });

      if (tags.length !== updateArticleDto.tagList.length) {
        throw new BadRequestException();
      }

      tagIDs = tags.map((tag) => tag.id);
    }

    return this.prismaService.articles.update({
      where: {
        id,
      },
      data: {
        title: updateArticleDto.title,
        description: updateArticleDto.description,
        body: updateArticleDto.body,
        tagIDs,
      },
    });
  }

  async remove(id: string, ownerId: string) {
    const article = await this.prismaService.articles.findUnique({
      where: {
        id,
      },
    });

    if (!article) {
      throw new NotFoundException();
    }

    if (article.authorId !== ownerId) {
      throw new UnauthorizedException();
    }

    return this.prismaService.articles.delete({
      where: {
        id,
      },
    });
  }
}
