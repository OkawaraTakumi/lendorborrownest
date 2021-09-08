import { InfoFollowDto } from '../dto/follow-user.dto';
import { Follow } from './user.interface';

export interface followPayload {
  infoFollow: InfoFollowDto;
  id: string;
}

//getFollowの返り値
export interface getFollowReturn {
  success: true;
  followData: Follow[];
  count: number;
}
