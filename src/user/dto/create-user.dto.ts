export class CreateUserDto {
  email: string;
  password: string;
  username: string;
  bio: string | null;
  image: string | null;
}
