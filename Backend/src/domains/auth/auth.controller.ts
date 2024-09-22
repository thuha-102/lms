import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthREQ } from './request/auth-login.request';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: AuthREQ) {
    return this.authService.login(body);
  }

  @Post('signup')
  async signup(@Body() body: AuthREQ) {
    return this.authService.signup(body);
  }
}
