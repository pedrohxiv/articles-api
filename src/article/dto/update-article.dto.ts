import { PartialType } from '@nestjs/mapped-types';

import { CreateArticleDto } from '@/article/dto/create-article.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
