import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import getDatabaseConfig from '../config/database.config';
import loggerConfig from '../config/logger.config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';
import { ActivitiesModule } from '../activities/activities.module';
import { SyncModule } from '../sync/sync.module';
import DashboardModule from 'src/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    LoggerModule.forRoot(loggerConfig),
    AuthModule,
    UsersModule,
    RoomsModule,
    ActivitiesModule,
    SyncModule,
    DashboardModule,
  ],
})
export class AppModule {}
