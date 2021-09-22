import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interface/user.interface';
import { followPayload } from './interface/follow-user.interface';
import { ObjectId } from 'mongodb';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async getUserName(emailForFind: FindUserDto) {
    const user = await this.userModel.findOne(emailForFind).select('name');
    return user;
  }

  async followUser(FollowPayload: followPayload) {
    const { email } = FollowPayload.infoFollow;
    const DBId = await this.userModel
      .findOne({ email: email })
      .select('_id, name');
    const user = await this.userModel.findOneAndUpdate(
      {
        _id: FollowPayload.id,
      },
      { $addToSet: { follow: DBId } }
    );

    if (!user) {
      throw new NotFoundException('ユーザーが見つかりませんでした');
    }
    return user;
  }

  async getFollow(id: string) {
    const followData = await this.userModel
      .findOne({ _id: id })
      .select('follow');
    const count = followData.follow.length;
    return {
      success: true,
      followData: followData.follow,
      count,
    };
  }

  async getFollower(id: string) {
    const myId = new ObjectId(id);
    console.log(myId, 'ObjectId');
    const followerData = await this.userModel.aggregate([
      {
        $match: { _id: { $ne: myId } },
      },
      {
        $match: { 'follow._id': id },
      },
      {
        $unwind: '$follow',
      },
      {
        $replaceRoot: {
          newRoot: '$follow',
        },
      },
    ]);

    if (!followerData) {
      throw new NotFoundException('取得に失敗しました');
    }
    const count = followerData.length;
    return {
      success: true,
      followerData,
      count,
    };
  }
}
