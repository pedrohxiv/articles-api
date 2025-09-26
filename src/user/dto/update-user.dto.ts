import {
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(20)
  username?: string;

  @IsOptional()
  bio?: string;

  @IsOptional()
  image?: string;
}
