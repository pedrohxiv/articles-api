import { Module } from '@nestjs/common';

import { ArticleController } from '@/article/article.controller';
import { ArticleService } from '@/article/article.service';
import { PrismaModule } from '@/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
