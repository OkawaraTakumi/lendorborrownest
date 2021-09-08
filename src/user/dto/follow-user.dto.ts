import { IsEmail } from 'class-validator';

export class InfoFollowDto {
  @IsEmail()
  readonly email!: string;
}
