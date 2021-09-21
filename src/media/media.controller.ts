import { Controller, Get, Param, Query } from '@nestjs/common';
import { MediaService } from './media.service';
import { Media } from 'src/model/entities/media.entity';
import { Source } from 'src/model/entities/source.entity';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  get(): string {
    return 'Media entry point';
  }

  @Get('all')
  getAllMedia(): Promise<Media[]> {
    return this.mediaService.getAllMedia();
  }

  @Get('create/:ownerId/:name')
  createMedia(
    @Param('ownerId') ownerId,
    @Param('name') name,
    @Query('sources') sources,
  ): Promise<Media> {
    const constructedSources: Array<Source> = [];

    if (!Array.isArray(sources)) {
      sources = [sources];
    }

    for (const url of sources) {
      const cs = new Source();
      cs.url = url;

      cs.isLocal = !cs.url.startsWith('http');

      constructedSources.push(cs);
    }

    return this.mediaService.createMedia(name, ownerId, constructedSources);
  }
}
