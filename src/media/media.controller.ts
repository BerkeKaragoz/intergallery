import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { Media } from 'src/model/entities/media.entity';
import { Source } from 'src/model/entities/source.entity';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { Response as ExpressRes } from 'express';
import { join } from 'path';

@UseGuards(AuthenticatedGuard)
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

  @Get('user')
  getUserMedia(@Request() req): Promise<Media[]> {
    return this.mediaService.getUserMedia(req.user);
  }

  @Get('/source/:mediaId')
  async getMediaSource(
    @Request() req,
    @Response() res: ExpressRes,
    @Param('mediaId') mediaId,
    @Query('src') sourceIndex,
  ) {
    const source = await this.mediaService.getUserMediaSource(
      req.user,
      mediaId,
      sourceIndex,
    );

    if (source.isLocal) {
      const fileAbsolutePath = join(this.mediaService.servingPath, source.url);
      res.sendFile(fileAbsolutePath);
    } else {
      res.redirect(source.url);
    }
  }

  @Post('create')
  createMedia(
    @Request() req,
    @Body('name') name,
    @Body('sources') sources,
  ): Promise<Media> {
    return this.mediaService.createMedia(name, req.user, sources);
  }
}
