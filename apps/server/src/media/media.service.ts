import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { FileService } from 'src/file/file.service';
import { MediaEntity, MediaType } from 'src/model/entities/media.entity';
import { SourceEntity } from 'src/model/entities/source.entity';
import { UserEntity } from 'src/model/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateMediaDto, CreateMediaInputDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { UserMediaDTO } from './dto/user-media.dto';

@Injectable()
export class MediaService {
  servingPath = this.configService.get<string>('SERVING_PATH');

  internalDirName = this.fileService.internalDirName;
  sourcesDirName = 'sources';
  thumbsDirName = 'thumbnails';

  internalDir = join(this.servingPath, this.internalDirName);
  sourcesDir = join(this.internalDir, this.sourcesDirName);
  thumbsDir = join(this.internalDir, this.thumbsDirName);

  constructor(
    @Inject(forwardRef(() => ConfigService))
    private configService: ConfigService,
    @Inject(forwardRef(() => FileService))
    private fileService: FileService,
    @InjectRepository(MediaEntity)
    private mediaRepository: Repository<MediaEntity>,
    @InjectRepository(SourceEntity)
    private sourceRepository: Repository<SourceEntity>,
  ) {}

  // getAllMedia(): Promise<MediaEntity[]> {
  //   return this.mediaRepository.find({
  //     relations: ['sources', 'owner'],
  //   });
  // }

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

  async getUserMediaById(
    user: UserEntity,
    id: MediaEntity['id'],
    hasSources = false,
  ): Promise<MediaEntity> {
    return await this.mediaRepository.findOneOrFail(id, {
      where: { owner: user.id },
      ...(hasSources ? { relations: ['sources'] } : {}),
      cache: true,
    });
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

  async createMultipleMedia(
    dto: CreateMediaInputDto[],
    owner: UserEntity,
  ): Promise<MediaEntity[]> {
    let newMediaArr: MediaEntity[] = [];

    for (const media of dto) {
      const newMedia = this.mediaRepository.create({
        name: media.name,
        type: media.type,
      });

      newMedia.owner = owner;
      newMedia.sources = media.sources;

      newMediaArr.push(newMedia);
    }

    const createdMedia = await this.mediaRepository.save(newMediaArr);

    newMediaArr = [];

    for (const media of createdMedia) {
      media.sources = media.sources.concat(
        this.fileService.addSources(media.sources, media.type),
      );

      newMediaArr.push(media);
    }

    return this.mediaRepository.save(newMediaArr);
  }

  async updateMedia(dto: UpdateMediaDto): Promise<MediaEntity> {
    const { id, name, owner, addedSources, deletedSourceIds, type } = dto;

    const media = await this.mediaRepository.findOneOrFail(id, {
      where: { owner: owner.id },
      relations: ['sources'],
      cache: true,
    });

    media.name = name;
    media.type = type;

    const existingSrcIds = media.sourceIds;

    if (deletedSourceIds.length > 0) {
      this.fileService.deleteSources(
        media.sources.filter((m) => deletedSourceIds.includes(m.id)),
      );

      await this.sourceRepository.delete(deletedSourceIds);

      media.sources = media.sources.filter(
        (m) => !deletedSourceIds.includes(m.id),
      );
    }

    if (addedSources.length > 0) {
      const savedSources = await this.sourceRepository.save(addedSources);

      media.sources.concat(
        savedSources.filter(
          ({ id, isLocal }) => !isLocal && !existingSrcIds.includes(id),
        ),
      );

      // Process local sources seperately so that thumbUrl can be updated
      media.sources = media.sources.concat(
        this.fileService.addSources(
          savedSources.filter(
            ({ id, isLocal }) => isLocal && !existingSrcIds.includes(id),
          ),
          media.type,
        ),
      );

      this.sourceRepository.save(addedSources);
    }

    return this.mediaRepository.save(media);
  }

  async deleteMultipleMedia(
    ids: MediaEntity['id'][],
    user: UserEntity,
  ): Promise<MediaEntity[]> {
    const mediaList = await this.mediaRepository.findByIds(ids, {
      where: { owner: user.id },
      relations: ['sources'],
      cache: true,
    });

    for (const media of mediaList)
      this.fileService.deleteSources(media.sources);

    return this.mediaRepository.remove(mediaList);
  }

  async createThumb(
    source: SourceEntity,
    type: MediaEntity['type'] = MediaType.UNKNOWN,
  ) {
    source.thumbUrl = await this.fileService.generateThumb(source, type);

    return this.sourceRepository.save(source);
  }

  /** @deprecated */
  createMedia(dto: CreateMediaDto): Promise<MediaEntity> {
    const { name, owner, sources, type } = dto;

    const newMedia = this.mediaRepository.create({ name, type });
    newMedia.owner = owner;
    newMedia.sources = sources;

    return this.mediaRepository.save(newMedia);
  }

  /** @deprecated */
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
}
