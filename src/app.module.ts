import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma.module';
import { TagModule } from '@/tag/tag.module';

@Module({
  imports: [PrismaModule, TagModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
