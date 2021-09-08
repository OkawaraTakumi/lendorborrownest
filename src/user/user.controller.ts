import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InfoFollowDto } from './dto/follow-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('followUser')
  followUser(@Body(ValidationPipe) infoFollow: InfoFollowDto) {
    return this.userService.followUser(infoFollow);
  }
}
