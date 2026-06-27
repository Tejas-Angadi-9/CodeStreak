import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activity, ActivityDocument } from './activity.schema';
import { ActivityDto, GetActivitiesDto } from './dto/activities.dto';
import { ACTIVITY_MESSAGES, USER_MESSAGES } from '../common/constants/messages';
import { User, UserDocument } from 'src/users/user.schema';
import { MILLISECONDS_PER_DAY } from './constants/activity.constant';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private async updateStreak(activityDate: string, user: UserDocument): Promise<void> {
    const { lastActivityDate, graceExpiresAt } = user;
    const newActivityTime = new Date(activityDate).getTime();
    const lastActivityTime = new Date(lastActivityDate ?? '').getTime();

    const diffDays = Math.round(
      Math.abs(lastActivityTime - newActivityTime) / MILLISECONDS_PER_DAY,
    );
    const graceExpiresAtTime = new Date(graceExpiresAt ?? '').getTime();

    if (newActivityTime <= lastActivityTime) return;

    const isYesterday = diffDays == 1;
    const isWithinGraceTime =
      diffDays == 2 && user.streakAtRisk && newActivityTime <= graceExpiresAtTime;

    let newStreak: number = user.currentStreak;
    if (isYesterday || isWithinGraceTime) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
    user.currentStreak = newStreak;
    user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
    user.lastActivityDate = activityDate;
    await user.save();
    return;
  }

  async getActivities(userId: string, query: GetActivitiesDto): Promise<ActivityDocument[]> {
    const page: number = query.page ?? 1;
    const limit: number = query.limit ?? 20;
    const skip: number = (page - 1) * limit;

    const filter: Record<string, unknown> = { createdBy: new Types.ObjectId(userId) };
    if (query.type) filter.type = query.type;
    try {
      const activities: ActivityDocument[] = await this.activityModel
        .find(filter)
        .sort({ activityDate: -1 })
        .skip(skip)
        .limit(limit);

      return activities;
    } catch {
      throw new InternalServerErrorException(ACTIVITY_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async createActivity(userId: string, activityDto: ActivityDto): Promise<ActivityDocument> {
    try {
      const existingUser: UserDocument | null = await this.userModel.findById(userId);
      if (!existingUser) {
        throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
      }

      const { activityDate } = activityDto;
      const activity: ActivityDocument = await this.activityModel.create({
        ...activityDto,
        createdBy: new Types.ObjectId(userId),
        createdAt: new Date().toISOString().split('T')[0],
      });

      await this.updateStreak(activityDate, existingUser);

      return activity;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(ACTIVITY_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async updateActivity(
    userId: string,
    activityId: string,
    activityDto: ActivityDto,
  ): Promise<ActivityDocument> {
    try {
      const activity: ActivityDocument | null = await this.activityModel.findById(activityId);

      if (!activity) throw new NotFoundException(ACTIVITY_MESSAGES.NOT_FOUND);
      if (activity.createdBy.toString() !== userId)
        throw new ForbiddenException(ACTIVITY_MESSAGES.NOT_AUTHORIZED_TO_MODIFY);

      const updatedActivity: ActivityDocument | null = await this.activityModel.findByIdAndUpdate(
        activityId,
        activityDto,
        { new: true },
      );

      if (!updatedActivity) throw new NotFoundException(ACTIVITY_MESSAGES.NOT_FOUND);

      return updatedActivity;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(ACTIVITY_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }
}
