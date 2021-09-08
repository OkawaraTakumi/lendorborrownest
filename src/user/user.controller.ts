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

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getFollow(@Request() req: any) {
    const { id } = req.user;
    return this.userService.getFollow(id);
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
