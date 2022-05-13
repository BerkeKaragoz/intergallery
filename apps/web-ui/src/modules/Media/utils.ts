import { SourceEntity } from "../Source";
import { CreateSourceDTO } from "../Source/source";
import { PaginatedDTO, PickByType } from "../../lib/types";
import { UserEntity } from "../User";

export enum MediaType {
  UNKNOWN = 0,
  PICTURE = 1,
  VIDEO = 2,
}

export const lengthMediaType = Object.keys(MediaType).length / 2;

// Types

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
  extends Pick<MediaEntity, "id" | "name" | "sourceIds" | "ownerId"> {
  type: PickByType<MediaType, number>;
  creationDate: string;
  updateDate: string;
}

export interface CreateMediaInputDTO extends Pick<MediaDTO, "name" | "type"> {
  sources: CreateSourceDTO[];
}

export type GetMediaInputDTO = Partial<Pick<PaginatedDTO, "page" | "perPage">>;
