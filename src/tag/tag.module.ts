import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma.module';
import { TagController } from '@/tag/tag.controller';
import { TagService } from '@/tag/tag.service';

@Module({
  imports: [PrismaModule],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
