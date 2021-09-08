import {
  Body,
  Controller,
  ValidationPipe,
  Post,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
    console.log(registUser, 9);
    return this.authService.regist(registUser);
  }

  @Get('getCurrentUser')
  @UseGuards(AuthGuard('jwt'))
  getCurrentuser(@Request() req: any) {
    return this.authService.getCurrentUser(req.user);
  }
}
