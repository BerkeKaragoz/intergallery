import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from 'src/model/entities/media.entity';
import { Source } from 'src/model/entities/source.entity';
import { User } from 'src/model/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
  private readonly _hostUrl = 'http://localhost:3000'; //TODO temp

  servingPath = this.configService.get<string>('SERVING_PATH');

  constructor(
    private configService: ConfigService,
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
    @InjectRepository(Source) private sourceRepository: Repository<Source>,
  ) {}

  getAllMedia(): Promise<Media[]> {
    return this.mediaRepository.find({
      relations: ['sources', 'owner'],
    });
  }

  async getUserMedia(user: any): Promise<Media[]> {
    const mediaList = await this.mediaRepository.find({
      where: { owner: user.id },
    });

    return mediaList;
  }

  getMediaById(id: number): Promise<Media> {
    return this.mediaRepository.findOneOrFail(id);
  }

  async getUserMediaSource(
    user: any,
    mediaId: number,
    sourceIndex = 0,
  ): Promise<Source> {
    const media = await this.mediaRepository.findOne(mediaId, {
      where: { owner: user.id },
      relations: ['sources'],
    });

    return media.sources[sourceIndex];
  }

  createMedia(
    name: string,
    owner: User,
    sources: Array<Source>,
  ): Promise<Media> {
    const newMedia = this.mediaRepository.create({ name });
    newMedia.owner = owner;
    newMedia.sources = sources;

    return this.mediaRepository.save(newMedia);
  }

  async updateMedia(id: number, name: string): Promise<Media> {
    const media = await this.getMediaById(id);
    media.name = name;
    return this.mediaRepository.save(media);
  }

  async deleteMedia(id: number): Promise<Media> {
    const media = await this.getMediaById(id);
    return this.mediaRepository.remove(media);
  }
}
