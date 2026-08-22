import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compact, filter, find, get, isNil, isNull, pick } from 'lodash';
import { Model, Types } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { Activity, ActivityDocument } from 'src/activities/activity.schema';
import { getTodaysDate, getWeekDates } from 'src/common/utils/date.util';
import { Room, RoomDocument } from 'src/rooms/room.schema';
import { User, UserDocument } from 'src/users/user.schema';
import { IResolveMembers } from './interfaces/dashboard.interface';

@Injectable()
class DashboardService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  private async resolveRoomMembers(userId: string, roomCode: string): Promise<IResolveMembers> {
    const room = await this.roomModel.findOne({ roomCode });
    if (isNull(room)) throw new NotFoundException('Room not found');

    const [member1, member2] = get(room, 'members');
    const currentUser: Types.ObjectId = String(member1) === userId ? member1 : member2;
    const otherUser: Types.ObjectId | undefined =
      String(currentUser) === String(member1) ? member2 : member1;

    return { currentUser, otherUser };
  }

  private fetchWeeksActivities(
    userIds: Types.ObjectId[],
    weekDates: string[],
  ): Promise<ActivityDocument[]> {
    return this.activityModel.find({ createdBy: { $in: userIds }, createdAt: { $in: weekDates } });
  }

  private buildHeatmap(
    weekActivities: ActivityDocument[],
    userId: Types.ObjectId,
    weekDates: string[],
  ): { date: string; isActive: boolean }[] {
    return weekDates.map((date) => ({
      date,
      isActive: weekActivities.some(
        (activity) => String(activity.createdBy) === String(userId) && activity.createdAt === date,
      ),
    }));
  }

  private buildUserSummary(
    users: UserDocument[],
    userId: Types.ObjectId,
    weekActivities: ActivityDocument[],
    weekDates: string[],
  ) {
    const foundUser = find(users, (user) => String(user._id) === String(userId));
    if (isNil(foundUser)) return null;

    const summaryFields = ['name', 'currentStreak', 'longestStreak'] as const;

    const today = getTodaysDate();
    const todaysActivities = filter(
      weekActivities,
      (activity) => String(activity.createdBy) === String(userId) && activity.createdAt === today,
    );

    const heatmap = this.buildHeatmap(weekActivities, userId, weekDates);

    return { ...pick(foundUser, summaryFields), todaysActivities, heatmap };
  }

  public async fetchDashboardDetails(userId: string, roomCode: string) {
    try {
      const { currentUser, otherUser } = await this.resolveRoomMembers(userId, roomCode);

      const userIds: Types.ObjectId[] = compact([currentUser, otherUser]);
      const users = await this.userModel.find({ _id: { $in: userIds } });

      const weekDates = getWeekDates();
      const weekActivities = await this.fetchWeeksActivities(userIds, weekDates);

      const currentUserDetails = this.buildUserSummary(
        users,
        currentUser,
        weekActivities,
        weekDates,
      );
      if (isNil(currentUserDetails)) throw new NotFoundException('User not found');

      const otherUserDetails = isNil(otherUser)
        ? null
        : this.buildUserSummary(users, otherUser, weekActivities, weekDates);

      return { roomCode, currentUserDetails, otherUserDetails };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch dashboard data');
    }
  }
}
export default DashboardService;
