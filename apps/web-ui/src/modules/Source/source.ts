import { API_BASE_URL } from "@/lib/api"
import { MediaEntity } from "@/modules/Media/utils"

export const getMediaSource = (id: SourceEntity["id"]) =>
   `${API_BASE_URL}/media/source/${id}`

export const getMediaSourceThumb = (id: SourceEntity["id"]) =>
   `${getMediaSource(id)}/thumb`

// Types

export interface SourceEntity {
   id: string
   url: string
   thumbUrl: string
   isLocal: boolean
   media: MediaEntity
}

export interface SourceDTO
   extends Pick<SourceEntity, "id" | "url" | "thumbUrl" | "isLocal"> {}

export interface CreateSourceDTO extends Pick<SourceEntity, "url" | "isLocal"> {}
