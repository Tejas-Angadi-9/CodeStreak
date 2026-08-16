import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateNameDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}

export class UpdateLeetcodeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  leetcodeUsername: string;
}

export class MessageResponseDto {
  @IsString()
  message: string;
}
