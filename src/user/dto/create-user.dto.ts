import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  readonly name!: string;
  @IsEmail()
  readonly email!: string;
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly password!: string;
}
