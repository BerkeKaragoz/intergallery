import { UserEntity } from 'src/model/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from 'src/model/entities/media.entity';
import { SourceEntity } from 'src/model/entities/source.entity';
import { Repository } from 'typeorm';
import { CreateMediaDto, CreateMediaInputDto } from './dto/create-media.dto';
import { UserMediaDTO } from './dto/user-media.dto';

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

  async getUserMedia(
    user: UserEntity,
    page = 1,
    perPage = 20,
  ): Promise<UserMediaDTO> {
    const [mediaList, total] = await this.mediaRepository.findAndCount({
      where: { owner: user.id },
      take: perPage,
      skip: (page - 1) * perPage,
      order: { creationDate: -1 },
      cache: true,
    });

    const dto = new UserMediaDTO(mediaList, total, page, perPage);

    return dto;
  }

  getMediaById(id: MediaEntity['id']): Promise<MediaEntity> {
    return this.mediaRepository.findOneOrFail(id);
  }

  async getUserMediaSource(
    user: Pick<UserEntity, 'id'>,
    mediaId: MediaEntity['id'],
    sourceIndex = 0,
  ): Promise<SourceEntity> {
    const media = await this.mediaRepository.findOne(mediaId, {
      where: { owner: user.id },
      relations: ['sources'],
    });

    return media.sources[sourceIndex];
  }

  async getUserSource(
    user: Pick<UserEntity, 'id'>,
    sourceId: SourceEntity['id'],
  ): Promise<SourceEntity> {
    const source = await this.sourceRepository.findOne(sourceId, {
      relations: ['media'],
    });

    if (source.media.ownerId === user.id) return source;
  }

  createMedia(dto: CreateMediaDto): Promise<MediaEntity> {
    const { name, owner, sources, type } = dto;

    const newMedia = this.mediaRepository.create({ name, type });
    newMedia.owner = owner;
    newMedia.sources = sources;

    return this.mediaRepository.save(newMedia);
  }

  createMultipleMedia(
    dto: CreateMediaInputDto[],
    owner: UserEntity,
  ): Promise<MediaEntity[]> {
    const newMediaArr: MediaEntity[] = [];

    for (const media of dto) {
      const newMedia = this.mediaRepository.create({
        name: media.name,
        type: media.type,
      });

      newMedia.owner = owner;
      newMedia.sources = media.sources;

      newMediaArr.push(newMedia);
    }

    return this.mediaRepository.save(newMediaArr);
  }

  async updateMedia(
    id: MediaEntity['id'],
    name: MediaEntity['name'],
  ): Promise<MediaEntity> {
    const media = await this.getMediaById(id);
    media.name = name;
    return this.mediaRepository.save(media);
  }

  async deleteMedia(id: MediaEntity['id']): Promise<MediaEntity> {
    const media = await this.getMediaById(id);
    return this.mediaRepository.remove(media);
  }
}
