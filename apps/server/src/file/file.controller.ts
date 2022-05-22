import { Controller, Get, Param, StreamableFile, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ApiTags } from '@nestjs/swagger';

//This will be deleted, testing, experimental purposes only
@ApiTags('file')
@Controller('file')
export class FileController {
  servingPath = this.configService.get<string>('SERVING_PATH');

  constructor(private configService: ConfigService) {}

  //
  // Below is for testing purposes unlike the service
  //

  @Get()
  file(): string {
    return 'File entry point: ' + this.servingPath;
  }

  @Get('download/*')
  getFile(@Param('0') filePath): StreamableFile {
    const fileAbsolutePath = join(this.servingPath, filePath);

    const file = createReadStream(fileAbsolutePath);

    return new StreamableFile(file);
  }

  @Get('get/*')
  getTestFile(@Param('0') filePath, @Res() res: Response): void {
    const fileAbsolutePath = join(this.servingPath, filePath);

    res.sendFile(fileAbsolutePath);
  }
}
