import { Module } from '@nestjs/common';
import { JwtAuthModule } from 'src/common/jwt-auth.module';
import SyncController from './sync.controller';
import SyncService from './sync.service';
import SyncProvider from './sync.provider';

@Module({
  imports: [JwtAuthModule],
  controllers: [SyncController],
  providers: [SyncService, SyncProvider],
})
export class SyncModule {}
