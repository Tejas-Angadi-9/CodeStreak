import { Module } from '@nestjs/common';
import DashboardController from './dashboard.controller';
import { JwtAuthModule } from 'src/common/jwt-auth.module';
import DashboardService from './dashboard.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from 'src/rooms/room.schema';
import { User, UserSchema } from 'src/users/user.schema';
import { Activity, ActivitySchema } from 'src/activities/activity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: User.name, schema: UserSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
    JwtAuthModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
class DashboardModule {}
export default DashboardModule;
