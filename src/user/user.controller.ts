import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { AuthGuard } from '@/auth/auth.guard';
import { CurrentUser } from '@/decorators/current-user.decorator';
import type { JwtPayload } from '@/types/jwt-payload.type';
import { UpdateUserDto } from '@/user/dto/update-user.dto';
import { UserService } from '@/user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':value')
  findOne(@Param('value') value: string) {
    if (/^[0-9a-fA-F]{24}$/.test(value)) {
      return this.userService.findById(value);
    }

    return this.userService.findByUsername(value);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.userService.update(id, updateUserDto, payload.sub);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() payload: JwtPayload) {
    return this.userService.remove(id, payload.sub);
  }
}
