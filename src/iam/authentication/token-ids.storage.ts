import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export class InvalidatedTokenError extends Error {}

@Injectable()
export class TokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient: Redis;

  constructor(private readonly configService: ConfigService) {}

  onApplicationBootstrap() {
    const redisUrl = this.configService.get<string>(
      'REDIS_URL',
      'redis://localhost:6379',
    );

    this.redisClient = new Redis(redisUrl);
  }
  onApplicationShutdown() {
    return this.redisClient.quit();
  }

  async cacheRefreshToken(userId: number, tokenId: string): Promise<void> {
    await this.redisClient.set(this.getUserKey(userId), tokenId);
  }

  async validateRefreshToken(
    userId: number,
    tokenId: string,
  ): Promise<boolean> {
    const storedTokenId = await this.redisClient.get(this.getUserKey(userId));
    if (tokenId !== storedTokenId) {
      throw new InvalidatedTokenError();
    }
    return storedTokenId === tokenId;
  }

  async invalidateRefreshToken(userId: number): Promise<void> {
    await this.redisClient.del(this.getUserKey(userId));
  }

  async invalidateForgotPasswordToken(tokenId: string): Promise<void> {
    await this.redisClient.del(this.getForgotPasswordKey(tokenId));
  }

  async cacheForgotPasswordToken(
    userId: number,
    tokenId: string,
  ): Promise<void> {
    await this.redisClient.set(
      this.getForgotPasswordKey(tokenId),
      userId,
      'EX',
      1000 * 60 * 30, // 30 mins to reset password
    );
  }

  async validateForgotPasswordToken(tokenId: string): Promise<number> {
    const userId = await this.redisClient.get(
      this.getForgotPasswordKey(tokenId),
    );
    if (!userId) {
      throw new InvalidatedTokenError('Invalid token');
    }
    return parseInt(userId, 10);
  }

  /**
   * Returns a key for a given user id
   */
  private getUserKey(userId: number): string {
    return `user:${userId}`;
  }

  /**
   * Returns a key for a given token
   */
  private getForgotPasswordKey(tokenId: string): string {
    return `forgot-password:${tokenId}`;
  }
}
