import { Injectable, InternalServerErrorException } from '@nestjs/common';
import LeetCode from 'leetcode-query';
import { INTERNAL_SERVER_ERROR } from 'src/common/constants/messages';
import { IFetchAccpetedLeetcodeSubmissionsResponse } from './interfaces/sync.interface';

@Injectable()
class SyncProvider {
  leetcode = new LeetCode();
  public async fetchAcceptedLeetcodeSubmissions(
    leetcodeUserName: string,
  ): Promise<IFetchAccpetedLeetcodeSubmissionsResponse[]> {
    try {
      const submissions = await this.leetcode.recent_submissions(leetcodeUserName);
      return submissions;
    } catch {
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }
  }
}
export default SyncProvider;
