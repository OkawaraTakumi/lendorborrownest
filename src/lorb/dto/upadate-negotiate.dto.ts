import { IsString } from 'class-validator';
//stateを変更する処理のペイロードはこのDtoを使う。
export class updateNegotiateDto {
  @IsString()
  readonly userFrom!: string;
  @IsString()
  readonly userTo!: string;
  @IsString()
  readonly negotiateItem!: string;
  @IsString()
  readonly negotiateDetail!: string;
  @IsString()
  readonly id!: string;
}
