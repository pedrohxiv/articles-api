import { Module } from '@nestjs/common';

import { ArticleModule } from '@/article/article.module';
import { AuthModule } from '@/auth/auth.module';
import { PrismaModule } from '@/database/prisma.module';
import { TagModule } from '@/tag/tag.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [PrismaModule, TagModule, UserModule, AuthModule, ArticleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
