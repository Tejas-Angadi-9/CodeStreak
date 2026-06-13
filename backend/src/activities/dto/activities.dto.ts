import { ActivityType, ActivityStatus } from '../../common/enums/activity.enums';

export class ActivityDto {
  type: ActivityType;
  title: string;
  description: string;
  status: ActivityStatus;
  activityDate: string;
}

export class GetActivitiesDto {
  type?: ActivityType;
  page?: number;
  limit?: number;
}

export class MessageResponseDto {
  message: string;
}
