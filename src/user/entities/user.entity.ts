import { Users } from '@prisma/client';

export class User implements Users {
  id: string;
  email: string;
  password: string;
  username: string;
  bio: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}
