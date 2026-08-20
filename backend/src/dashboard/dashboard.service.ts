import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compact, find, get, isNil, isNull, pick } from 'lodash';
import { Model, Types } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { Room, RoomDocument } from 'src/rooms/room.schema';
import { User, UserDocument } from 'src/users/user.schema';

@Injectable()
class DashboardService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  public async fetchDashboardDetails(userId: string, roomCode: string) {
    try {
      const room: RoomDocument | null = await this.roomModel.findOne({ roomCode });
      if (isNull(room)) throw new NotFoundException('Room not found');

      const [member1, member2] = get(room, 'members');
      const currentUser: Types.ObjectId = String(member1) === userId ? member1 : member2;
      const otherUser: Types.ObjectId = currentUser === member1 ? member2 : member1;
      const userIds: Types.ObjectId[] = compact([currentUser, otherUser]);
      const users = await this.userModel.find({ _id: { $in: userIds } });

      const currentUserDetails = find(users, (user) => String(user._id) === String(currentUser));
      const otherUserDetails = isNil(otherUser)
        ? null
        : find(users, (user) => String(user._id) === String(otherUser));

      if (isNil(currentUserDetails)) throw new NotFoundException('User not found');

      const summaryFields = ['name', 'currentStreak', 'longestStreak'];
      const dashboardDetails = {
        roomCode,
        currentUserDetails: pick(currentUserDetails, summaryFields),
        otherUserDetails: isNil(otherUserDetails) ? null : pick(otherUserDetails, summaryFields),
      };

      return dashboardDetails;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch dashboard data');
    }
  }
}
export default DashboardService;
