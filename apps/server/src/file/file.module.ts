import { forwardRef, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { MediaModule } from "src/media/media.module"
import { FileController } from "./file.controller"
import { FileService } from "./file.service"

@Module({
   imports: [forwardRef(() => ConfigModule), forwardRef(() => MediaModule)],
   exports: [FileService],
   controllers: [FileController],
   providers: [FileService],
})
export class FileModule {}
