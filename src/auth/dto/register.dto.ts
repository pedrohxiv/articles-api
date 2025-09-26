import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @MaxLength(20)
  username: string;
}
