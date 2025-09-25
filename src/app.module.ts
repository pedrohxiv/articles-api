import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma.module';
import { TagModule } from '@/tag/tag.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [PrismaModule, TagModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
