import { Module } from '@nestjs/common';
import { JwtAuthModule } from 'src/common/jwt-auth.module';
import SyncController from './sync.controller';
import SyncService from './sync.service';
import SyncProvider from './sync.provider';
import { UsersModule } from 'src/users/users.module';
import { ActivitiesModule } from 'src/activities/activities.module';

@Module({
  imports: [JwtAuthModule, UsersModule, ActivitiesModule],
  controllers: [SyncController],
  providers: [SyncService, SyncProvider],
})
export class SyncModule {}
