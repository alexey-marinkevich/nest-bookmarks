import { Injectable, ForbiddenException } from '@nestjs/common';
import { AuthDto } from 'src/dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(body: AuthDto) {
    const { email, password } = body;

    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      throw new ForbiddenException('User with this email already exists');
    }

    const hashedPassword = await argon.hash(password);

    return this.prisma.user.create({
      data: { email, password: hashedPassword },
      select: { email: true, id: true },
    });
  }

  async signin(body: AuthDto) {
    const { email, password } = body;

    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credentials is incorrect');
    }

    const passwordMatches = await argon.verify(user.password, password);

    if (!passwordMatches) {
      throw new ForbiddenException('Credentials is incorrect');
    }

    delete user.password;
    return user;
  }
}
