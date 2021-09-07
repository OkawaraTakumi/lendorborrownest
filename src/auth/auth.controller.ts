import { Body, Controller, ValidationPipe, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthInfoDto } from './dto/auth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body(ValidationPipe) authInfo: AuthInfoDto) {
    return this.authService.login(authInfo);
  }

  @Post('register')
  register(@Body(ValidationPipe) registUser: CreateUserDto) {
    return this.authService.regist(registUser);
  }
}
