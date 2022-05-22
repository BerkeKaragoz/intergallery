import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, mkdirSync, renameSync, symlinkSync } from 'fs';
import { dirname, extname, join } from 'path';
import * as sharp from 'sharp';
import { MediaEntity } from 'src/model/entities/media.entity';
import { SourceEntity } from 'src/model/entities/source.entity';
import { UserEntity } from 'src/model/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateMediaDto, CreateMediaInputDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { UserMediaDTO } from './dto/user-media.dto';

@Injectable()
export class MediaService {
  servingPath = this.configService.get<string>('SERVING_PATH');
  internalDir = join(this.servingPath, '.intergallery');
  sourcesDir = join(this.internalDir, 'sources');
  thumbsDir = join(this.internalDir, 'thumbnails');
  symlinksDir = join(this.sourcesDir, 'symlinks');

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

  async getUserMediaById(
    user: UserEntity,
    id: MediaEntity['id'],
  ): Promise<MediaEntity> {
    return await this.mediaRepository.findOneOrFail(id, {
      where: { owner: user.id },
      //relations: ['sources'],
      cache: true,
    });
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
      for (let i = 0; i < media.sources.length; i++) {
        if (!existsSync(this.symlinksDir)) {
          mkdirSync(this.symlinksDir, {
            recursive: true,
          });
        }

        const internalSrcPath = join(this.sourcesDir, media.sources[i].id);
        const originalSrcPath = join(this.servingPath, media.sources[i].url);
        if (!existsSync(internalSrcPath)) {
          const symlinkName = `${media.sources[i].id}${extname(
            originalSrcPath,
          )}`;

          //Move the original source to the internal folder
          renameSync(originalSrcPath, internalSrcPath);
          //Create a symlink to the moved source at the internal folder with extension
          symlinkSync(internalSrcPath, join(this.symlinksDir, symlinkName));
          //Create a symlink to the symlink in the place of the original file
          symlinkSync(join(this.symlinksDir, symlinkName), originalSrcPath);

          /* This way lookups are easier, file locations can be
            reverted, doesn't interfere with UX (you can still 
            use things like images in your OS) and files can be
            moved without breaking since you can move symlinks 
            but not their targets 
          */
        }

        media.sources[i].thumbUrl = this.createThumb(
          media.sources[i].id,
          media.sources[i].url,
        );
      }

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

    media.sources = media.sources.filter(
      (m) => !deletedSourceIds.includes(m.id),
    );

    if (deletedSourceIds.length > 0)
      await this.sourceRepository.delete(deletedSourceIds);

    if (addedSources.length > 0)
      media.sources = media.sources.concat(addedSources);

    return this.mediaRepository.save(media);
  }

  async deleteMedia(
    id: MediaEntity['id'],
    user: UserEntity,
  ): Promise<MediaEntity> {
    const media = await this.getUserMediaById(user, id);
    return this.mediaRepository.remove(media);
  }

  createThumb(sourceId, sourceUrl) {
    const thumbName = `${sourceId}.webp`;
    const thumbPath = join(this.thumbsDir, thumbName);

    if (!existsSync(this.thumbsDir)) {
      mkdirSync(this.thumbsDir, {
        recursive: true,
      });
    }

    if (!existsSync(thumbPath))
      sharp(join(this.servingPath, sourceUrl))
        .resize(200)
        .toFormat('webp')
        .toFile(thumbPath)
        .catch((err) => console.error(err));

    return `${dirname(this.thumbsDir)}/${thumbName}`;
  }
}
