import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ROUTES } from 'src/common/constants/routes';
import CurrentUser from 'src/common/decorators/current-user.decorator';
import JwtGuard from 'src/common/guards/jwt.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import SyncService from './sync.service';
import { LEETCODE_USER_NAME_QUERY_PARAM } from './constants/sync.constant';
import { IFetchAccpetedLeetcodeSubmissionsResponse } from './interfaces/sync.interface';

@Controller(ROUTES.SYNC.BASE)
@UseGuards(JwtGuard)
class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get(ROUTES.SYNC.LEETCODE)
  async syncLeetcodeAcceptedSubmissions(
    @CurrentUser() user: JwtPayload,
    @Query(LEETCODE_USER_NAME_QUERY_PARAM) leetcodeUserName: string,
  ): Promise<IFetchAccpetedLeetcodeSubmissionsResponse[]> {
    const leetcodeSyncSubmissionResponse = await this.syncService.syncLeetcodeAcceptedSubmissions(
      user.sub,
      leetcodeUserName,
    );
    return leetcodeSyncSubmissionResponse;
  }
}

export default SyncController;
