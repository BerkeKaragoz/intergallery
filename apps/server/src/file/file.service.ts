import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, rm, renameSync, symlinkSync } from 'fs';
import { join, extname } from 'path';
import { MediaService } from 'src/media/media.service';
import { SourceEntity } from 'src/model/entities/source.entity';
import * as sharp from 'sharp';
import { ConfigService } from '@nestjs/config';
import fetch from 'cross-fetch';

@Injectable()
export class FileService {
  servingPath = this.configService.get<string>('SERVING_PATH');

  internalDirName = '.intergallery';

  constructor(
    @Inject(forwardRef(() => ConfigService))
    private configService: ConfigService,
    @Inject(forwardRef(() => MediaService))
    private mediaService: MediaService,
  ) {}

  createThumb(source: SourceEntity) {
    const thumbName = `${source.id}.webp`;
    const thumbPath = join(this.mediaService.thumbsDir, thumbName);

    if (!existsSync(this.mediaService.thumbsDir)) {
      mkdirSync(this.mediaService.thumbsDir, {
        recursive: true,
      });
    }

    if (!source.isLocal)
      fetch(source.url).then((res) =>
        res.arrayBuffer().then((buffer) => {
          sharp(Buffer.from(buffer))
            .resize(200)
            .toFormat('webp')
            .toFile(thumbPath)
            .catch((err) => console.error(err));
        }),
      );
    else
      sharp(join(this.mediaService.servingPath, source.id))
        .resize(200)
        .toFormat('webp')
        .toFile(thumbPath)
        .catch((err) => console.error(err));

    return `${this.mediaService.internalDirName}/${this.mediaService.thumbsDirName}/${thumbName}`;
  }

  deleteSourceThumbs(sourceList: SourceEntity[]) {
    for (let i = 0; i < sourceList.length; i++)
      rm(join(this.mediaService.thumbsDir, `${sourceList[i].id}.webp`), null);
    return sourceList;
  }

  addSource(sourceList: SourceEntity[]) {
    for (let i = 0; i < sourceList.length; i++) {
      if (sourceList[i].isLocal) {
        const originalSrcPath = join(this.servingPath, sourceList[i].url);
        const internalSrcPath = join(
          this.mediaService.sourcesDir,
          `${sourceList[i].id}${extname(sourceList[i].url)}`,
        );

        if (!existsSync(internalSrcPath)) {
          //Move the original source to the internal folder
          renameSync(originalSrcPath, internalSrcPath);
          //Create a symlink to the symlink in the place of the original file
          symlinkSync(internalSrcPath, originalSrcPath);

          // This way lookups are easier, file locations can be
          // reverted, doesn't interfere with UX (you can still
          // use things like images in your OS) and files can be
          // moved without breaking since you can move symlinks
          // but not their targets
        }
      }

      sourceList[i].thumbUrl = this.createThumb(sourceList[i]);
    }

    return sourceList;
  }
}
