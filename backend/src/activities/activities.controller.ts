import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import JwtGuard from '../common/guards/jwt.guard';
import CurrentUser from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { ActivityDocument } from './activity.schema';
import { ActivityDto, GetActivitiesDto, MessageResponseDto } from './dto/activities.dto';
import { ACTIVITY_MESSAGES } from '../common/constants/messages';
import { ROUTES } from '../common/constants/routes';

@Controller(ROUTES.ACTIVITIES.BASE)
@UseGuards(JwtGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  async getActivities(
    @CurrentUser() user: JwtPayload,
    @Query() query: GetActivitiesDto,
  ): Promise<ActivityDocument[]> {
    const activities: ActivityDocument[] = await this.activitiesService.getActivities(
      user.sub,
      query,
    );
    return activities;
  }

  @Post()
  async createActivity(
    @CurrentUser() user: JwtPayload,
    @Body() body: ActivityDto,
  ): Promise<ActivityDocument> {
    const createdActivity: ActivityDocument = await this.activitiesService.createActivity(
      user.sub,
      body,
    );
    return createdActivity;
  }

  @Put(ROUTES.ACTIVITIES.BY_ID)
  async updateActivity(
    @CurrentUser() user: JwtPayload,
    @Param('id') activityId: string,
    @Body() body: ActivityDto,
  ): Promise<ActivityDocument> {
    const updatedActivity: ActivityDocument = await this.activitiesService.updateActivity(
      user.sub,
      activityId,
      body,
    );
    return updatedActivity;
  }
}
