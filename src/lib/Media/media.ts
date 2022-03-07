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
  id: number;
  name: string;
  type: MediaType;
  creationDate: Date;
  updateDate: Date;
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

export interface GetMediaInputDTO
  extends Partial<Pick<PaginatedDTO, "page" | "perPage">> {}
