import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthDto } from 'src/dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(body: AuthDto) {
    const { email, password } = body;
    //check if email already exists
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await argon.hash(password);
    // save new user to a db
    return this.prisma.user.create({
      data: { email, password: hashedPassword },
      select: { email: true, id: true, password: true },
    });
  }
  signin() {
    return 'he';
  }
}
