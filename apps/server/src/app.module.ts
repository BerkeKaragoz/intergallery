import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config';
import { ORMConfig } from 'ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileController } from './file/file.controller';
import { MediaController } from './media/media.controller';
import { MediaService } from './media/media.service';
import { MediaEntity } from './model/entities/media.entity';
import { SourceEntity } from './model/entities/source.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local'],
      load: [config],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ORMConfig.mainDBConfig),
    TypeOrmModule.forRoot(ORMConfig.sessionDBConfig),
    TypeOrmModule.forFeature([MediaEntity, SourceEntity]),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController, FileController, MediaController],
  providers: [AppService, MediaService],
})
export class AppModule {}
