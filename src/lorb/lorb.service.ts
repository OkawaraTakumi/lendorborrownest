import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class LorbService {
  constructor(
    @InjectModel('LorB') private readonly LorBModel: Model<BoxContents>
  ) {}

  async createLorB(createLorBPayload) {
    const {
      title,
      detailClass,
      aboutDetail,
      userTo,
      userToName,
      userFrom,
      userFromName,
      userForApprove,
    } = createLorBPayload;

    const LorBdetail = {
      title: title,
      detailClass: detailClass,
      aboutDetail: aboutDetail,
      userForApprove: userForApprove,
    };

    const reqUserTo = new ObjectId(userTo);
    const reqUserFrom = new ObjectId(userFrom);

    const LorBWillCreate = {
      LorBBox: LorBdetail,
      userTo: reqUserTo,
      userToName: userToName,
      userFrom: reqUserFrom,
      userFromName: userFromName,
    };

    try {
      await this.LorBModel.create(LorBWillCreate);
      return {
        success: true,
      };
    } catch (error) {
      throw new NotAcceptableException('テーブルを作成できませんでした');
    }
  }
}
