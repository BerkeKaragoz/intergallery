import { CreateMediaDto, CreateMediaInputDto } from './dto/create-media.dto';
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
import { MediaEntity } from 'src/model/entities/media.entity';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { Response as ExpressRes } from 'express';
import { join } from 'path';
import { ApiTags, ApiBasicAuth } from '@nestjs/swagger';
import { User } from 'src/core/decorator/user.decorator';
import { UserMediaDTO } from './dto/user-media.dto';

@ApiTags('media')
@ApiBasicAuth()
@UseGuards(AuthenticatedGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('all')
  getAllMedia(): Promise<MediaEntity[]> {
    return this.mediaService.getAllMedia();
  }

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

    if (source.isLocal) {
      const fileAbsolutePath = join(this.mediaService.servingPath, source.url);
      res.sendFile(fileAbsolutePath);
    } else {
      res.redirect(source.url);
    }
  }

  @Get('/source/:sourceId')
  async getSource(
    @Request() req,
    @Response() res: ExpressRes,
    @Param('sourceId') sourceId,
  ) {
    const source = await this.mediaService.getUserSource(req.user, sourceId);

    if (source.isLocal) {
      const fileAbsolutePath = join(this.mediaService.servingPath, source.url);
      res.sendFile(fileAbsolutePath, { maxAge: '2 days' }, (err) => {
        if (err) console.error(err);
      });
    } else {
      res.redirect(source.url);
    }
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
}
