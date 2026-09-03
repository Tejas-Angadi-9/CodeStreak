import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import SyncProvider from './sync.provider';
import { LEETCODE_USER_NOT_FOUND } from './constants/sync.constant';
import { INTERNAL_SERVER_ERROR } from 'src/common/constants/messages';
import { UsersService } from 'src/users/users.service';
import { IFetchAccpetedLeetcodeSubmissionsResponse } from './interfaces/sync.interface';

@Injectable()
class SyncService {
  constructor(
    private readonly syncProvider: SyncProvider,
    private readonly usersService: UsersService,
  ) {}

  public async syncLeetcodeAcceptedSubmissions(userId: string, leetcodeUserName: string) {
    if (!leetcodeUserName) {
      throw new BadRequestException(LEETCODE_USER_NOT_FOUND);
    }

    try {
      await this.usersService.getProfile(userId);

      const acceptedSubmissions: IFetchAccpetedLeetcodeSubmissionsResponse[] =
        await this.syncProvider.fetchAcceptedLeetcodeSubmissions(leetcodeUserName);
      console.log({ acceptedSubmissions });
      return acceptedSubmissions;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }
  }
}
export default SyncService;
