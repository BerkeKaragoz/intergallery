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
  getUserMedia(@Request() req): Promise<MediaEntity[]> {
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

  @Post()
  createMedia(
    @User() user,
    @Body() dto: CreateMediaInputDto,
  ): Promise<MediaEntity> {
    const { name, sources } = dto;
    console.log(dto);
    return this.mediaService.createMedia({ name, owner: user, sources });
  }
}
