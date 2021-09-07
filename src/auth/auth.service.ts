import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { AuthInfoDto } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async validateUser({ email, password }: AuthInfoDto) {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new NotFoundException('ユーザーが存在しません');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('認証に失敗しました');
    }
    return isValid;
  }

  async login({ email, password }: AuthInfoDto) {
    if (await this.validateUser({ email, password })) {
      const user = await this.userModel.findOne({ email });
      const payload = { userid: user._id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
  }

  async regist(user: CreateUserDto) {
    const createUser = new this.userModel({
      name: user.name,
      password: await bcrypt.hash(user.password, 12),
    });
    return await createUser.save();
  }

  async getCurrentUser(user: any) {
    if (!user) {
      throw new NotFoundException('ユーザーが見つかりませんでした');
    }
    return user;
  }
  // async validateUser({ name, password }: CreateUserDto) {
  //   const user = await this.userService.findOne(name);
  //   const isValid = await bcrypt.compare(password, user.password);
  //   if (!isValid) {
  //     throw new UnauthorizedException('認証に失敗しました');
  //   }
  //   return isValid;
  // }
}
