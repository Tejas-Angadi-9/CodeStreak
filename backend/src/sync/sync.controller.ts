import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ROUTES } from 'src/common/constants/routes';
import CurrentUser from 'src/common/decorators/current-user.decorator';
import JwtGuard from 'src/common/guards/jwt.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import SyncService from './sync.service';

@Controller(ROUTES.SYNC.BASE)
@UseGuards(JwtGuard)
class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get(ROUTES.SYNC.LEETCODE)
  async syncLeetcodeAcceptedSubmissions(
    @CurrentUser() user: JwtPayload,
    @Query('leetcodeUserName') leetcodeUserName: string,
  ) {
    console.log('leetcodeUserName: ', leetcodeUserName);
    await this.syncService.syncLeetcodeAcceptedSubmissions(user.sub, leetcodeUserName);
  }
}

export default SyncController;
