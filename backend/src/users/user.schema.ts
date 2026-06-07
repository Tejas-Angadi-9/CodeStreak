import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: false })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  googleId: string;

  @Prop({ type: String, default: null })
  leetcodeUsername: string | null;

  @Prop({ default: 0 })
  currentStreak: number;

  @Prop({ default: 0 })
  longestStreak: number;

  @Prop({ type: String, default: null })
  lastActivityDate: string | null;

  @Prop({ default: false })
  streakAtRisk: boolean;

  @Prop({ type: String, default: null })
  graceExpiresAt: string | null;

  @Prop({ type: [Types.ObjectId], ref: 'Room', default: [] })
  rooms: Types.ObjectId[];

  @Prop({ required: true })
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
