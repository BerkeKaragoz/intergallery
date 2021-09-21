import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from 'src/model/entities/media.entity';
import { Source } from 'src/model/entities/source.entity';
import { User } from 'src/model/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
    @InjectRepository(Source) private sourceRepository: Repository<Source>,
  ) {}

  getAllMedia(): Promise<Media[]> {
    return this.mediaRepository.find({
      relations: ['sources'],
    });
  }

  getMediaById(id: number): Promise<Media> {
    return this.mediaRepository.findOneOrFail(id);
  }

  createMedia(
    name: string,
    owner: number,
    sources: Array<Source>,
  ): Promise<Media> {
    const newMedia = this.mediaRepository.create({ name });
    const user = new User();
    user.id = owner;
    newMedia.owner = user;
    newMedia.type = 0;

    for (const s of sources) {
      s.media = newMedia;
      this.sourceRepository.save(s);
    }

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
