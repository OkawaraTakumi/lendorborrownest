import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { CreateLorBDto } from './dto/create-lorb';
import { ConfigService } from '@nestjs/config';
import { ChengeStateDto } from './dto/approve-create.dto';

@Injectable()
export class LorbService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel('LorB') private readonly LorBModel: Model<BoxContents>
  ) {}

  async createLorB(createLorBPayload: CreateLorBDto) {
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
      return this.updateLorBDetail(createLorBPayload);
    }
  }

  async updateLorBDetail(updateLorBPayload: CreateLorBDto) {
    const {
      userFrom,
      userTo,
      detailClass,
      aboutDetail,
      title,
      userForApprove,
    } = updateLorBPayload;

    const LorBWillUpdate = {
      title: title,
      detailClass: detailClass,
      aboutDetail: aboutDetail,
      LorBState: this.configService.get<string>('ON_MAKING_LORB'),
      userForApprove: userForApprove,
    };

    // const reqUserTo = ObjectId(userTo)
    // const reqUserFrom = ObjectId(userFrom)
    console.log(LorBWillUpdate);
    const LorBUpdated = await this.LorBModel.findOneAndUpdate(
      {
        userFrom,
        userTo,
      },
      { $push: { LorBBox: LorBWillUpdate } }
    );
    if (!LorBUpdated) {
      throw new NotFoundException('更新に失敗しました');
    }

    return {
      success: true,
    };
  }

  async approveCreate(approveCreatePayload: ChengeStateDto) {
    const { userFrom, userTo, id } = approveCreatePayload;
    const reqApproveId = new ObjectId(id);
    const negotiateWillApprove = await this.LorBModel.findOneAndUpdate(
      {
        userFrom,
        userTo,
        'LorBBox._id': reqApproveId,
      },
      {
        $set: {
          'LorBBox.$.LorBState': this.configService.get<string>('KEEP_LORB'),
        },
      }
    );
    if (!negotiateWillApprove) {
      throw new NotFoundException('承認に失敗しました');
    }
    return {
      success: true,
    };
  }

  async rejectCreate(rejectCreatePayload: ChengeStateDto) {
    const { userFrom, userTo, id } = rejectCreatePayload;
    console.log(userFrom);
    console.log(userTo);
    console.log(id);
    const reqApproveId = new ObjectId(id);

    const negotiateWillApprove = await this.LorBModel.findOneAndUpdate(
      {
        userFrom,
        userTo,
        'LorBBox._id': reqApproveId,
      },
      {
        $set: {
          'LorBBox.$.LorBState': this.configService.get<string>('REJECTED'),
        },
      }
    );
    if (!negotiateWillApprove) {
      throw new NotFoundException('承認に失敗しました');
    }

    return {
      success: true,
    };
  }
}
