import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InfoFollowDto } from './dto/follow-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getFollow')
  @UseGuards(AuthGuard('jwt'))
  getFollow(@Request() req: any) {
    const { id } = req.user;
    return this.userService.getFollow(id);
  }

  @Get('getFollower')
  @UseGuards(AuthGuard('jwt'))
  getFollower(@Request() req: any) {
    const { id } = req.user;
    return this.userService.getFollower(id);
  }

  @Post('followUser')
  @UseGuards(AuthGuard('jwt'))
  followUser(
    @Body(ValidationPipe) infoFollow: InfoFollowDto,
    @Request() req: any
  ) {
    const { id } = req.user;
    return this.userService.followUser({ infoFollow, id });
  }
}
