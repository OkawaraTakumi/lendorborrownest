import {
  Body,
  Controller,
  ValidationPipe,
  Post,
  Get,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { response, Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthInfoDto } from './dto/auth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body(ValidationPipe) authInfo: AuthInfoDto,
    @Res() res: Response
  ) {
    const returnLogin = await this.authService.login(authInfo);
    res.cookie('auth-cookie', returnLogin.token, returnLogin.options);
    res.json(returnLogin.data);
  }

  @Post('register')
  async register(@Body(ValidationPipe) registUser: CreateUserDto) {
    return await this.authService.regist(registUser);
  }

  @Get('getCurrentUser')
  @UseGuards(AuthGuard('jwt'))
  async getCurrentuser(@Req() req: any) {
    return await this.authService.getCurrentUser(req.user);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Res() res: Response) {
    const returnLogin = await this.authService.logout();
    res.clearCookie('auth-cookie');
    return res.sendStatus(200);
  }
}
