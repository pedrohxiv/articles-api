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

import { AuthGuard } from '@/auth/auth.guard';
import { CreateTagDto } from '@/tag/dto/create-tag.dto';
import { UpdateTagDto } from '@/tag/dto/update-tag.dto';
import { TagService } from '@/tag/tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body(new ValidationPipe()) createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.update(id, updateTagDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }
}
