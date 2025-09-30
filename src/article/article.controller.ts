import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { ArticleService } from '@/article/article.service';
import { CreateArticleDto } from '@/article/dto/create-article.dto';
import { UpdateArticleDto } from '@/article/dto/update-article.dto';
import { AuthGuard } from '@/auth/auth.guard';
import { CurrentUser } from '@/decorators/current-user.decorator';
import type { JwtPayload } from '@/types/jwt-payload.type';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body(new ValidationPipe()) createArticleDto: CreateArticleDto,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.articleService.create(createArticleDto, payload.sub);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':param')
  findOne(@Param('param') param: string) {
    return this.articleService.findOne(param);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateArticleDto: UpdateArticleDto,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.articleService.update(id, updateArticleDto, payload.sub);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() payload: JwtPayload) {
    return this.articleService.remove(id, payload.sub);
  }
}
