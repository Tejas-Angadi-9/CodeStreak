import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import { User, UserDocument } from '../users/user.schema';
import { isNil } from 'lodash';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client({
      clientId: this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.getOrThrow<string>('GOOGLE_SECRET_ID'),
      redirectUri: 'postmessage',
    });
  }

  async googleLogin(accessCode: string): Promise<string> {
    try {
      const { tokens } = await this.googleClient.getToken(accessCode);
      const idToken = tokens.id_token;

      if (isNil(idToken)) {
        throw new UnauthorizedException('Failed to retrieve ID token from Google');
      }

      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException('Invalid Google token');

      const { sub: googleId, email, name } = payload;

      const userPayload = {
        googleId,
        email,
        name,
        createdAt: new Date().toISOString().split('T')[0],
      };

      const user = await this.userModel.findOneAndUpdate(
        { googleId },
        { $setOnInsert: userPayload },
        { upsert: true, new: true },
      );

      const token: string = this.jwtService.sign({
        sub: user._id.toString(),
        email: user.email,
      });
      return token;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Google login failed');
    }
  }
}
