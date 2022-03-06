import { MediaEntity } from "../Media/media";

export interface SourceEntity {
  id: number;
  url: string;
  isLocal: boolean;
  media: MediaEntity;
}

export interface SourceDTO
  extends Pick<SourceEntity, "id" | "url" | "isLocal"> {}

export interface CreateSourceDTO
  extends Pick<SourceEntity, "url" | "isLocal"> {}
