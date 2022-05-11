import { MediaEntity } from "@/modules/Media/utils";

export interface SourceEntity {
  id: string;
  url: string;
  isLocal: boolean;
  media: MediaEntity;
}

export interface SourceDTO
  extends Pick<SourceEntity, "id" | "url" | "isLocal"> {}

export interface CreateSourceDTO
  extends Pick<SourceEntity, "url" | "isLocal"> {}
