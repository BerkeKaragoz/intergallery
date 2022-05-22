import { forwardRef, Module } from '@nestjs/common';
import { FileModule } from 'src/file/file.module';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from 'src/model/entities/media.entity';
import { SourceEntity } from 'src/model/entities/source.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => ConfigModule),
    forwardRef(() => FileModule),
    TypeOrmModule.forFeature([MediaEntity, SourceEntity]),
  ],
  exports: [MediaService],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
