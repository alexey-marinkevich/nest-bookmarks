import { Controller, Post, Body } from '@nestjs/common';
import { Res } from '@nestjs/common/decorators';
import { AuthDto } from 'src/dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() body: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.signup(body);
    return res.set('x-auth-header', token).status(200).end();
  }

  @Post('signin')
  signin(@Body() body: AuthDto) {
    return this.authService.signin(body);
  }
}
