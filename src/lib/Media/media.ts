import { SourceEntity } from "../Source";
import { CreateSourceDTO } from "../Source/source";
import { PaginatedDTO } from "../types";
import { UserEntity } from "../User";

export enum MediaType {
  UNKNOWN = 0,
  PICTURE = 1,
  VIDEO = 2,
}

export interface MediaEntity {
  id: string;
  name: string;
  type: MediaType;
  creationDate: string | Date;
  updateDate: string | Date;
  sourceIds: number[];
  sources: SourceEntity[];
  ownerId: string;
  owner: UserEntity;
}

export interface MediaDTO
  extends Pick<MediaEntity, "id" | "name" | "type" | "sourceIds" | "ownerId"> {
  creationDate: string;
  updateDate: string;
}

export interface CreateMediaInputDTO extends Pick<MediaDTO, "name"> {
  sources: CreateSourceDTO[];
}

export type GetMediaInputDTO = Partial<Pick<PaginatedDTO, "page" | "perPage">>;
