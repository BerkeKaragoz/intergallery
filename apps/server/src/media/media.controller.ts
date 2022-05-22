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
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { Response as ExpressRes } from 'express';
import { extname, join } from 'path';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { User } from 'src/core/decorator/user.decorator';
import { MediaEntity } from 'src/model/entities/media.entity';
import { CreateMediaInputDto } from './dto/create-media.dto';
import { UpdateMediaInputDto } from './dto/update-media.dto';
import { UserMediaDTO } from './dto/user-media.dto';
import { MediaService } from './media.service';

@ApiTags('media')
@ApiBasicAuth()
@UseGuards(AuthenticatedGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // @Get('all')
  // getAllMedia(): Promise<MediaEntity[]> {
  //   return this.mediaService.getAllMedia();
  // }

  @Get('user')
  getUserMedia(
    @User() user,
    @Query('page') page,
    @Query('perPage') perPage,
  ): Promise<UserMediaDTO> {
    return this.mediaService.getUserMedia(user, +page, +perPage);
  }

  @Get('/:mediaId')
  getMedia(@Request() req, @Param('mediaId') mediaId: MediaEntity['id']) {
    return this.mediaService.getUserMediaById(req.user, mediaId);
  }

  @Get('/source/:sourceId/thumb')
  async getSourceThumb(
    @Request() req,
    @Response() res: ExpressRes,
    @Param('sourceId') sourceId,
  ) {
    const source = await this.mediaService.getUserSource(req.user, sourceId);

    if (source.isLocal)
      res.sendFile(
        // check thumbsDir first since these are locals
        join(this.mediaService.thumbsDir, `${sourceId}.webp`),
        { maxAge: '2 days' },
        (thumbUrlErr) =>
          thumbUrlErr &&
          res.sendFile(
            join(this.mediaService.servingPath, source.thumbUrl),
            (err: Error & { statusCode?: number }) =>
              err && res.sendStatus(err.statusCode ?? 404),
          ),
      );
    else res.redirect(301, source.thumbUrl);
  }

  @Get('/source/:sourceId')
  async getSource(
    @Request() req,
    @Response() res: ExpressRes,
    @Param('sourceId') sourceId,
  ) {
    if (sourceId === typeof undefined) {
      res.sendStatus(404);
      return;
    }

    const source = await this.mediaService.getUserSource(req.user, sourceId);

    if (source.isLocal)
      res.sendFile(
        join(this.mediaService.sourcesDir, source.id + extname(source.url)),
        (internalFileErr) =>
          internalFileErr &&
          res.sendFile(
            join(this.mediaService.servingPath, source.url),
            (err: Error & { statusCode?: number }) =>
              err && res.sendStatus(err.statusCode ?? 404),
          ),
      );
    else res.redirect(source.url);
  }

  @Post()
  createMedia(
    @User() user,
    @Body() dto: CreateMediaInputDto | CreateMediaInputDto[],
  ): Promise<MediaEntity | MediaEntity[]> {
    if (Array.isArray(dto))
      return this.mediaService.createMultipleMedia(dto, user);
    else return this.mediaService.createMedia({ ...dto, owner: user });
  }

  @Post('/update')
  updateMedia(
    @User() user,
    @Body() dto: UpdateMediaInputDto,
  ): Promise<MediaEntity> {
    return this.mediaService.updateMedia({ ...dto, owner: user });
  }

  @Post('/delete')
  deleteMedia(
    @User() user,
    @Body() id: MediaEntity['id'],
  ): Promise<MediaEntity> {
    return this.mediaService.deleteMedia(id, user);
  }

  /** @deprecated */
  @Get('/:mediaId/source')
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

    if (source.isLocal)
      res.sendFile(
        join(this.mediaService.sourcesDir, source.id),
        (symlinkFileErr) =>
          symlinkFileErr &&
          res.sendFile(
            join(this.mediaService.servingPath, source.url),
            (err: Error & { statusCode?: number }) => {
              res.sendStatus(err.statusCode ?? 404);
            },
          ),
      );
    else res.redirect(source.url);
  }
}
