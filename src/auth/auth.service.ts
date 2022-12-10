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
    });

    return this.signToken(createdUser.id, createdUser.email);
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

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string) {
    const data = {
      id: userId,
      email,
    };

    const token = await this.jwt.signAsync(data, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET_KEY'),
    });

    return `Bearer ${token}`;
  }
}
