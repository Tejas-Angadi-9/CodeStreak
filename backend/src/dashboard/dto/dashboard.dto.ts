import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ROOM_CODE_PATTERN } from 'src/common/constants/room.constant';

export class DashboardDto {
  @IsString()
  @IsNotEmpty()
  @Matches(ROOM_CODE_PATTERN, { message: 'Invalid room code format' })
  roomCode: string;
}
