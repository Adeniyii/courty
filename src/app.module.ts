import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, IamModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
