import { IsString } from 'class-validator';

export class CreateLorBDto {
  @IsString()
  readonly title!: string;
  @IsString()
  readonly detailClass!: string;
  @IsString()
  readonly aboutDetail!: string;
  @IsString()
  readonly userTo!: string;
  @IsString()
  readonly userToName!: string;
  @IsString()
  readonly userFrom!: string;
  @IsString()
  readonly userFromName!: string;
  @IsString()
  readonly userForapprove!: string;
}
