import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgres://postgres:postgrespw@localhost:49153/mydb?schema=public',
        },
      },
    });
  }
}