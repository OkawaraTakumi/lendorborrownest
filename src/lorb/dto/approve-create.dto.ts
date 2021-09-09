import { IsString } from 'class-validator';
//stateを変更する処理のペイロードはこのDtoを使う。
export class ChengeStateDto {
  @IsString()
  readonly userFrom!: string;
  @IsString()
  readonly userTo!: string;
  @IsString()
  readonly id!: string;
}
