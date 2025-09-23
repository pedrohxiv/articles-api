import { PartialType } from '@nestjs/mapped-types';

import { CreateTagDto } from '@/tag/dto/create-tag.dto';

export class UpdateTagDto extends PartialType(CreateTagDto) {}
