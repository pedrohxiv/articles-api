import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma.module';
import { TagModule } from '@/tag/tag.module';
import { UserModule } from '@/user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, TagModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
