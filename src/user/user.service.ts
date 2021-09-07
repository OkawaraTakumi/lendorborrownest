import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  async getCurrentUser(user: any) {
    if (!user) {
      throw new NotFoundException('ユーザーが見つかりませんでした');
    }
    return user;
  }
}
