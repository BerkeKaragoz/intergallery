import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config';
import ormconfig from 'ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileController } from './file/file.controller';
import { User } from './model/entities/user.entity';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { MediaController } from './media/media.controller';
import { MediaService } from './media/media.service';
import { Media } from './model/entities/media.entity';
import { Source } from './model/entities/source.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      load: [config],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([User, Media, Source]),
  ],
  controllers: [AppController, FileController, UserController, MediaController],
  providers: [AppService, UserService, MediaService],
})
export class AppModule {}
