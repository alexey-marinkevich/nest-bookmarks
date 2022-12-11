import { Controller, Post, Body } from '@nestjs/common';
import { AuthDto } from 'src/dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: AuthDto) {
    const token = await this.authService.signup(body);

    return {
      Authorization: token,
    };
  }

  @Post('signin')
  async signin(@Body() body: AuthDto) {
    const token = await this.authService.signin(body);

    return {
      Authorization: token,
    };
  }
}
