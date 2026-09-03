import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getProfile(userId: string): Promise<Omit<User, 'googleId'>> {
    try {
      const user = await this.userModel.findById(userId).select('-googleId').lean();
      if (!user) throw new NotFoundException('User not found');

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Failed to fetch user profile',
        (error as Error).message,
      );
    }
  }

  async updateName(userId: string, name: string): Promise<void> {
    try {
      const user = await this.userModel.findByIdAndUpdate(userId, {
        name,
      });
      if (!user) throw new NotFoundException('User not found');
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update name');
    }
  }

  async updateLeetcode(userId: string, leetcodeUsername: string): Promise<void> {
    try {
      const user = await this.userModel.findByIdAndUpdate(userId, {
        leetcodeUsername,
      });
      if (!user) throw new NotFoundException('User not found');
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update leetcode');
    }
  }
}
