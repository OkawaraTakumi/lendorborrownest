import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthInfoDto {
  @IsEmail()
  readonly email!: string;
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  readonly password!: string;
}
