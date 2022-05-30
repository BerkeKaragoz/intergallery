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
} from "@nestjs/common"
import { ApiBasicAuth, ApiTags } from "@nestjs/swagger"
import { Response as ExpressRes } from "express"
import { extname, join } from "path"
import { AuthenticatedGuard } from "src/auth/authenticated.guard"
import { User } from "src/core/decorator/user.decorator"
import { FileService } from "src/file/file.service"
import { MediaEntity, MediaType } from "src/model/entities/media.entity"
import { CreateMediaInputDto } from "./dto/create-media.dto"
import { UpdateMediaInputDto } from "./dto/update-media.dto"
import { UserMediaDTO } from "./dto/user-media.dto"
import { MediaService } from "./media.service"

@ApiTags("media")
@ApiBasicAuth()
@UseGuards(AuthenticatedGuard)
@Controller("media")
export class MediaController {
   constructor(
      private readonly mediaService: MediaService,
      private readonly fileService: FileService
   ) {}

   // @Get('all')
   // getAllMedia(): Promise<MediaEntity[]> {
   //   return this.mediaService.getAllMedia();
   // }

   @Get("user")
   getUserMedia(
      @User() user,
      @Query("page") page,
      @Query("perPage") perPage
   ): Promise<UserMediaDTO> {
      return this.mediaService.getUserMedia(user, +page, +perPage)
   }

   @Get("/:mediaId")
   getMedia(@Request() req, @Param("mediaId") mediaId: MediaEntity["id"]) {
      return this.mediaService.getUserMediaById(req.user, mediaId)
   }

   @Get("/source/:sourceId/thumb")
   async getSourceThumb(
      @Request() req,
      @Response() res: ExpressRes,
      @Param("sourceId") sourceId
   ) {
      const source = await this.mediaService.getUserSource(req.user, sourceId)
      const pathAtThumbsDir = join(this.mediaService.thumbsDir, `${sourceId}.webp`)

      res.sendFile(
         // Send thumbsDir first since these are locals
         pathAtThumbsDir,
         { maxAge: "2 days" },
         (thumbsDirErr) => {
            if (thumbsDirErr)
               res.sendFile(
                  // Otherwise, check if thumb exist at thumbUrl
                  join(this.mediaService.servingPath, source.thumbUrl),
                  (thumbUrlErr) => {
                     if (thumbUrlErr && source.media.type !== MediaType.VIDEO)
                        this.mediaService
                           .createThumb(source, source.media.type)
                           .then(() => {
                              res.sendFile(
                                 // Otherwise, generate the thumb and send it
                                 // not video because it can be data intensive
                                 pathAtThumbsDir,
                                 (err: Error & { statusCode?: number }) =>
                                    err && res.sendStatus(err.statusCode ?? 404) // Otherwise, give up :(
                              )
                           })
                  }
               )
         }
      )
   }

   @Get("/source/:sourceId")
   async getSource(
      @Request() req,
      @Response() res: ExpressRes,
      @Param("sourceId") sourceId
   ) {
      if (sourceId === typeof undefined) {
         res.sendStatus(404)
         return
      }

      const source = await this.mediaService.getUserSource(req.user, sourceId)

      if (source.isLocal)
         res.sendFile(
            join(this.mediaService.sourcesDir, source.id + extname(source.url)),
            (internalFileErr) =>
               internalFileErr &&
               res.sendFile(
                  join(this.mediaService.servingPath, source.url),
                  (err: Error & { statusCode?: number }) =>
                     err && res.sendStatus(err.statusCode ?? 404)
               )
         )
      else res.redirect(301, source.url)
   }

   @Post()
   createMedia(
      @User() user,
      @Body() dto: CreateMediaInputDto | CreateMediaInputDto[]
   ): Promise<MediaEntity[]> {
      if (Array.isArray(dto)) return this.mediaService.createMultipleMedia(dto, user)
      else return this.mediaService.createMultipleMedia([dto], user)
   }

   @Post("/update")
   updateMedia(
      @User() user,
      @Body() dto: UpdateMediaInputDto
   ): Promise<MediaEntity> {
      return this.mediaService.updateMedia({ ...dto, owner: user })
   }

   @Post("/delete")
   deleteMedia(
      @User() user,
      @Body("ids") ids: MediaEntity["id"] | MediaEntity["id"][]
   ): Promise<MediaEntity[]> {
      if (Array.isArray(ids)) return this.mediaService.deleteMultipleMedia(ids, user)
      else return this.mediaService.deleteMultipleMedia([ids], user)
   }

   /** @deprecated */
   @Get("/:mediaId/source")
   async getMediaSource(
      @Request() req,
      @Response() res: ExpressRes,
      @Param("mediaId") mediaId,
      @Query("src") sourceIndex
   ) {
      const source = await this.mediaService.getUserMediaSource(
         req.user,
         mediaId,
         sourceIndex
      )

      if (source.isLocal)
         res.sendFile(
            join(this.mediaService.sourcesDir, source.id),
            (symlinkFileErr) =>
               symlinkFileErr &&
               res.sendFile(
                  join(this.mediaService.servingPath, source.url),
                  (err: Error & { statusCode?: number }) => {
                     res.sendStatus(err.statusCode ?? 404)
                  }
               )
         )
      else res.redirect(source.url)
   }
}
