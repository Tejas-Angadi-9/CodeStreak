import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ActivityType, ActivityStatus } from '../common/enums/activity.enums';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: false })
export class Activity {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: Object.values(ActivityStatus) })
  status: ActivityStatus;

  @Prop({ required: true, enum: Object.values(ActivityType) })
  type: ActivityType;

  @Prop({ required: true })
  activityDate: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true })
  createdAt: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
ActivitySchema.index({ createdBy: 1, activityDate: 1 });
