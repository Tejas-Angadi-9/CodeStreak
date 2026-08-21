import { Types } from 'mongoose';

export interface IResolveMembers {
  currentUser: Types.ObjectId;
  otherUser: Types.ObjectId | undefined;
}
