import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { AuthInfoDto } from './dto/auth-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
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
      const payload = { name: user.name, email: user.email, id: user.id };
      const options = {
        expires: new Date(
          Date.now() + this.configService.get<string>('JWT_EXPIRE')
        ),
        httpOnly: true,
      };
      return {
        token: this.jwtService.sign(payload),
        data: { success: true, user: { ...payload } },
        options,
      };
    }
  }

  logout() {
    const options = {
      expires: new Date(
        Date.now() + this.configService.get<string>('JWT_EXPIRE')
      ),
      httpOnly: true,
    };
    return {
      token: '',
      options,
    };
  }

  async regist(user: CreateUserDto) {
    const createUser = new this.userModel({
      name: user.name,
      email: user.email,
      password: await bcrypt.hash(user.password, 12),
    });
    return await createUser.save();
  }

  async getCurrentUser({ id }) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('ユーザーが見つかりませんでした');
    }
    return { user: user };
  }
}
