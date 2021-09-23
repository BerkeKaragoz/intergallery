import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config';
import ormconfig from 'ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileController } from './file/file.controller';
import { MediaController } from './media/media.controller';
import { MediaService } from './media/media.service';
import { Media } from './model/entities/media.entity';
import { Source } from './model/entities/source.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      load: [config],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([Media, Source]),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController, FileController, MediaController],
  providers: [AppService, MediaService],
})
export class AppModule {}
