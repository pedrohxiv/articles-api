import { Tags } from '@prisma/client';

export class Tag implements Tags {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
