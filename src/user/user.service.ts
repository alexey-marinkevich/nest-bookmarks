import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: parseInt(id),
      },
    });
    if (!user) {
      throw new BadRequestException('User is not found');
    }

    delete user.password;

    return user;
  }

  async aboutMe(req) {
    console.log(req);
    const user = await this.prisma.user.findUnique({
      where: { id: req.id },
    });

    if (!user) {
      throw new BadRequestException('User is not found');
    }

    delete user.password;
    return user;
  }
}
