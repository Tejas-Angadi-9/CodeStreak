import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activity, ActivityDocument } from './activity.schema';
import { ActivityDto, CreateActivityDto, GetActivitiesDto } from './dto/activities.dto';
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
    const newActivityTime: number = new Date(activityDate).getTime();
    const lastActivityTime: number = new Date(lastActivityDate ?? '').getTime();

    const diffDays: number = Math.round(
      Math.abs(lastActivityTime - newActivityTime) / MILLISECONDS_PER_DAY,
    );
    const graceExpiresAtTime: number = new Date(graceExpiresAt ?? '').getTime();

    if (newActivityTime <= lastActivityTime) return;

    const isYesterday: boolean = diffDays == 1;
    const isWithinGraceTime: boolean =
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

  private canEditActivity(activityDate: string): boolean {
    const currentTime: number = new Date().getTime();
    const activityTime: number = new Date(activityDate).getTime();

    const diffDays: number = Math.round(
      Math.abs(currentTime - activityTime) / MILLISECONDS_PER_DAY,
    );

    const isWithinEditWindow: boolean = diffDays == 1 || diffDays == 0;
    return isWithinEditWindow;
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

  async createActivity(
    userId: string,
    createActivityDto: CreateActivityDto,
  ): Promise<ActivityDocument> {
    try {
      const existingUser: UserDocument | null = await this.userModel.findById(userId);
      if (!existingUser) {
        throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
      }

      const { activityDate } = createActivityDto;
      const activity: ActivityDocument = await this.activityModel.create({
        ...createActivityDto,
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
    updateActivityDto: ActivityDto,
  ): Promise<ActivityDocument> {
    try {
      const activity: ActivityDocument | null = await this.activityModel.findById(activityId);

      if (!activity) throw new NotFoundException(ACTIVITY_MESSAGES.NOT_FOUND);
      if (activity.createdBy.toString() !== userId)
        throw new ForbiddenException(ACTIVITY_MESSAGES.NOT_AUTHORIZED_TO_MODIFY);

      const isWithinEditWindow: boolean = this.canEditActivity(activity.activityDate);
      if (!isWithinEditWindow) throw new ForbiddenException(ACTIVITY_MESSAGES.EDIT_WINDOW_EXPIRED);

      const updatedActivity: ActivityDocument | null = await this.activityModel.findByIdAndUpdate(
        activityId,
        updateActivityDto,
        { new: true },
      );

      if (!updatedActivity) throw new NotFoundException(ACTIVITY_MESSAGES.NOT_FOUND);
      return updatedActivity;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException(ACTIVITY_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }
}
