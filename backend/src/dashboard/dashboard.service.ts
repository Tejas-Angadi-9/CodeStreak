import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isNull } from 'lodash';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { Room, RoomDocument } from 'src/rooms/room.schema';

@Injectable()
class DashboardService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  public async fetchDashboardDetails(userId: string, roomCode: string) {
    try {
      const room: string | null = await this.roomModel.findOne({ roomCode });
      if (isNull(room)) throw new NotFoundException('Room not found');

      // From the room get the members. And fetch the user info of those members
      return room;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch dashboard data');
    }
  }
}
export default DashboardService;
