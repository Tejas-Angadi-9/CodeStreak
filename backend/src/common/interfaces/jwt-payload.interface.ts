import { IsEmail, IsString } from 'class-validator';

export class JwtPayload {
  @IsString()
  sub: string;

  @IsEmail()
  email: string;
}
