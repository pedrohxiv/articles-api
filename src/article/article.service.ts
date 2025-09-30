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

    const existingArticle = await this.prismaService.articles.findUnique({
      where: {
        slug,
      },
    });

    if (existingArticle) {
      throw new ConflictException();
    }

    const article = await this.prismaService.articles.create({
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

    if (tagIDs.length) {
      await this.prismaService.tags.updateMany({
        where: {
          id: { in: tagIDs },
        },
        data: {
          articleIDs: { push: article.id },
        },
      });
    }

    return article;
  }

  async findAll({ author, tag }: { author?: string; tag?: string }) {
    const articles = await this.prismaService.articles.findMany({
      where: {
        AND: [
          author ? { author: { username: author } } : {},
          tag ? { tags: { some: { name: tag } } } : {},
        ],
      },
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

    let newTagIDs: string[] = [];

    if (updateArticleDto.tagList && updateArticleDto.tagList.length > 0) {
      const tags = await this.prismaService.tags.findMany({
        where: {
          name: { in: updateArticleDto.tagList },
        },
      });

      if (tags.length !== updateArticleDto.tagList.length) {
        throw new BadRequestException();
      }

      newTagIDs = tags.map((tag) => tag.id);
    }

    const oldTagIDs = article.tagIDs || [];

    const tagsToRemove = oldTagIDs.filter((id) => !newTagIDs.includes(id));
    const tagsToAdd = newTagIDs.filter((id) => !oldTagIDs.includes(id));

    if (tagsToRemove.length) {
      await this.prismaService.tags.updateMany({
        where: { id: { in: tagsToRemove } },
        data: {
          articleIDs: {
            set: [],
          },
        },
      });

      for (const tagId of tagsToRemove) {
        const tag = await this.prismaService.tags.findUnique({
          where: { id: tagId },
        });

        if (tag?.articleIDs?.length) {
          await this.prismaService.tags.update({
            where: { id: tagId },
            data: {
              articleIDs: tag.articleIDs.filter((aId) => aId !== article.id),
            },
          });
        }
      }
    }

    for (const tagId of tagsToAdd) {
      const tag = await this.prismaService.tags.findUnique({
        where: { id: tagId },
      });

      if (tag) {
        const updatedArticleIDs = tag.articleIDs
          ? [...tag.articleIDs, article.id]
          : [article.id];

        await this.prismaService.tags.update({
          where: { id: tagId },
          data: { articleIDs: updatedArticleIDs },
        });
      }
    }

    return this.prismaService.articles.update({
      where: {
        id,
      },
      data: {
        title: updateArticleDto.title,
        description: updateArticleDto.description,
        body: updateArticleDto.body,
        tagIDs: newTagIDs,
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
