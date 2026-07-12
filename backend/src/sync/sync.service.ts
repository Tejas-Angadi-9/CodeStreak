import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import SyncProvider from './sync.provider';
import { LEETCODE_USER_NOT_FOUND } from './constants/sync.constant';

@Injectable()
class SyncService {
  constructor(private readonly syncProvider: SyncProvider) {}

  public async syncLeetcodeAcceptedSubmissions(userId: string, leetcodeUserName: string) {
    // TODO: Check whether do we need to validate the userId or not
    if (!leetcodeUserName) {
      throw new BadRequestException(LEETCODE_USER_NOT_FOUND);
    }
    try {
      const acceptedSubmissions =
        await this.syncProvider.fetchAcceptedLeetcodeSubmissions(leetcodeUserName);
      console.log({ acceptedSubmissions });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw InternalServerErrorException;
    }
  }
}
export default SyncService;
