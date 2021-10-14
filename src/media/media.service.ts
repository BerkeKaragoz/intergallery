import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from 'src/model/entities/media.entity';
import { SourceEntity } from 'src/model/entities/source.entity';
import { UserEntity } from 'src/model/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateMediaDto } from './dto/create-media.dto';

@Injectable()
export class MediaService {
  servingPath = this.configService.get<string>('SERVING_PATH');

  constructor(
    private configService: ConfigService,
    @InjectRepository(MediaEntity)
    private mediaRepository: Repository<MediaEntity>,
    @InjectRepository(SourceEntity)
    private sourceRepository: Repository<SourceEntity>,
  ) {}

  getAllMedia(): Promise<MediaEntity[]> {
    return this.mediaRepository.find({
      relations: ['sources', 'owner'],
    });
  }

  async getUserMedia(user: any): Promise<MediaEntity[]> {
    const mediaList = await this.mediaRepository.find({
      where: { owner: user.id },
    });

    return mediaList;
  }

  getMediaById(id: number): Promise<MediaEntity> {
    return this.mediaRepository.findOneOrFail(id);
  }

  async getUserMediaSource(
    user: any,
    mediaId: number,
    sourceIndex = 0,
  ): Promise<SourceEntity> {
    const media = await this.mediaRepository.findOne(mediaId, {
      where: { owner: user.id },
      relations: ['sources'],
    });

    return media.sources[sourceIndex];
  }

  createMedia(dto: CreateMediaDto): Promise<MediaEntity> {
    const { name, owner, sources } = dto;

    const newMedia = this.mediaRepository.create({ name });
    newMedia.owner = owner;
    newMedia.sources = sources;

    return this.mediaRepository.save(newMedia);
  }

  async updateMedia(id: number, name: string): Promise<MediaEntity> {
    const media = await this.getMediaById(id);
    media.name = name;
    return this.mediaRepository.save(media);
  }

  async deleteMedia(id: number): Promise<MediaEntity> {
    const media = await this.getMediaById(id);
    return this.mediaRepository.remove(media);
  }
}
