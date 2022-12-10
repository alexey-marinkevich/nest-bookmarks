import { Injectable, ForbiddenException } from '@nestjs/common';
import { AuthDto } from 'src/dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config/dist';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

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

    const createdUser = await this.prisma.user.create({
      data: { email, password: hashedPassword },
      select: { id: true, email: true },
    });
    console.log(createdUser);
    const token = await this.signToken(
      createdUser.id.toString(),
      createdUser.email,
    );

    return `Bearer ${token}`;
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

  signToken(userId: string, email: string) {
    const data = {
      sub: userId,
      email,
    };

    return this.jwt.signAsync(data, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET_KEY'),
    });
  }
}
