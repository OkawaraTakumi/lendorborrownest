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
import { deleteDto } from './dto/delete-lorb.dto';
import { updateNegotiateDto } from './dto/upadate-negotiate.dto';

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
      LorBState: Number(this.configService.get<string>('ON_MAKING_LORB')),
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
          'LorBBox.$.LorBState': Number(
            this.configService.get<string>('KEEP_LORB')
          ),
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
          'LorBBox.$.LorBState': Number(
            this.configService.get<string>('REJECTED')
          ),
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

  async getOnMaking(getId) {
    const userForApprove = getId;
    const onMaking = await this.LorBModel.aggregate([
      {
        $match: {
          'LorBBox.LorBState': Number(
            this.configService.get<string>('ON_MAKING_LORB')
          ),
        },
      },
      {
        $unwind: '$LorBBox',
      },
      {
        $match: {
          'LorBBox.LorBState': Number(
            this.configService.get<string>('ON_MAKING_LORB')
          ),
        },
      },
      {
        $match: {
          'LorBBox.userForApprove': userForApprove,
        },
      },
    ]);

    if (!onMaking) {
      throw new NotFoundException('取得に失敗しました');
    }
    const count = onMaking.length;

    return {
      success: true,
      onMaking: {
        onMaking: onMaking,
        count: count,
      },
    };
  }

  async getOnBeingSuggested(getId) {
    const user = getId;
    const onBeingSuggested = await this.LorBModel.aggregate([
      {
        $match: { userTo: user },
      },
      {
        $unwind: '$LorBBox',
      },
      {
        $match: {
          'LorBBox.LorBState': Number(
            this.configService.get<string>('ON_SUGGEUSING')
          ),
        },
      },
    ]);

    if (!onBeingSuggested) {
      throw new NotAcceptableException('取得に失敗しました');
    }
    console.log(onBeingSuggested);
    const count = onBeingSuggested.length;

    return {
      success: true,
      onBeingSuggested: {
        onBeingSuggested,
        count,
      },
    };
  }

  async getLorBCompleted(getId) {
    const user = getId;
    console.log('完了済みの取得動いてます');
    // const reqUserFrom = ObjectId(userFrom)

    const LCompleted = await this.LorBModel.aggregate([
      {
        $match: { userFrom: user },
      },
      {
        $unwind: '$LorBBox',
      },
      {
        $match: {
          'LorBBox.LorBState': Number(
            this.configService.get<string>('COMPLETED')
          ),
        },
      },
    ]);

    const BCompleted = await this.LorBModel.aggregate([
      {
        $match: { userTo: user },
      },
      {
        $unwind: '$LorBBox',
      },
      {
        $match: {
          'LorBBox.LorBState': Number(
            this.configService.get<string>('COMPLETED')
          ),
        },
      },
    ]);

    // if(!LorBCompleted) {
    //     return next (new ErrorResponse('完了済みの貸し借りはありません', 400))
    // }

    return {
      success: true,
      completed: {
        LCompleted,
        BCompleted,
      },
    };
  }

  async getLorBKeepLorB(getId) {
    const user = getId;
    console.log(user);
    const LKeepOn = await this.LorBModel.aggregate([
      {
        $match: { userFrom: user },
      },
      {
        $unwind: '$LorBBox',
      },
      {
        $match: {
          'LorBBox.LorBState': Number(
            this.configService.get<string>('KEEP_LORB')
          ),
        },
      },
    ]);

    const BKeepOn = await this.LorBModel.aggregate([
      {
        $match: { userTo: user },
      },
      {
        $unwind: '$LorBBox',
      },
      {
        $match: {
          'LorBBox.LorBState': Number(
            this.configService.get<string>('KEEP_LORB')
          ),
        },
      },
    ]);

    return {
      success: true,
      keepLorB: {
        LKeepOn: LKeepOn,
        LCount: LKeepOn.length,
        BKeepOn: BKeepOn,
        BCount: BKeepOn.length,
      },
    };
  }

  async deleteLorBtable(deletePayload: deleteDto) {
    const { userFrom, userTo, id } = deletePayload;
    const reqLorBId = new ObjectId(id);
    try {
      await this.LorBModel.findOneAndUpdate(
        {
          userFrom,
          userTo,
          'LorBBox._id': reqLorBId,
        },
        {
          $set: {
            'LorBBox.$.LorBState': Number(
              this.configService.get<string>('COMPLETED')
            ),
          },
        }
      );

      return {
        success: true,
      };
    } catch {
      throw new NotFoundException('取得に失敗しました');
    }
  }

  async rejectNegotiate(rejectNegotiatePayload) {
    const { userFrom, userTo, id } = rejectNegotiatePayload;

    const reqApproveId = new ObjectId(id);

    const negotiateWillApprove = await this.LorBModel.findOneAndUpdate(
      {
        userFrom,
        userTo,
        'LorBBox._id': reqApproveId,
      },
      {
        $set: {
          'LorBBox.$.LorBState': Number(
            this.configService.get<string>('KEEP_LORB')
          ),
        },
      }
    );
    if (!negotiateWillApprove) {
      throw new NotFoundException('取得に失敗しました');
    }

    return {
      success: true,
    };
  }

  async updateNegotiate(updateNegotiatePayload: updateNegotiateDto) {
    const { userFrom, userTo, negotiateItem, negotiateDetail, id } =
      updateNegotiatePayload;

    const negotiateWillUpdate = {
      negotiateItem: negotiateItem,
      negotiateDetail: negotiateDetail,
    };
    console.log(id, 'idはこれ');
    const reqNegotiateId = new ObjectId(id);
    console.log(this.configService.get<string>('ON_SUGGEUSING'));
    const negotiateUpdated = await this.LorBModel.findOneAndUpdate(
      {
        userFrom,
        userTo,
        'LorBBox._id': reqNegotiateId,
      },
      {
        $set: {
          'LorBBox.$.negotiateItem': negotiateItem,
          'LorBBox.$.negotiateDetail': negotiateDetail,
          'LorBBox.$.LorBState': Number(
            this.configService.get<string>('ON_SUGGEUSING')
          ),
        },
      }
    );
    console.log(negotiateUpdated);
    if (!negotiateUpdated && negotiateDetail) {
      throw new NotFoundException('更新に失敗しました');
    }

    return {
      success: true,
    };
  }
}
