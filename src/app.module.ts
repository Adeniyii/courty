import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [UsersModule, IamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
