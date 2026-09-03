import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ROOM_CODE_PATTERN } from '../../common/constants/room.constant';

export class MessageResponseDto {
  @IsString()
  message: string;
}

export class CreateRoomResponseDto extends MessageResponseDto {
  @IsString()
  @Matches(ROOM_CODE_PATTERN, { message: 'Invalid room code format' })
  roomCode: string;
}

export class JoinRoomDto {
  @IsString()
  @IsNotEmpty()
  @Matches(ROOM_CODE_PATTERN, { message: 'Invalid room code format' })
  roomCode: string;
}
