import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

export class GoogleLoginResponseDto {
  @IsString()
  message: string;
}

export class VerifyTokenResponseDto {
  @IsString()
  message: string;

  @ValidateNested()
  @Type(() => JwtPayload)
  user: JwtPayload;
}
