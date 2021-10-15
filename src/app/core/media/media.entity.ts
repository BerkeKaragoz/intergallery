export enum MediaType {
  UNKNOWN = 0,
  PICTURE = 1,
  VIDEO = 2,
}

export interface SourceEntity {
  id: number;
  url: string;
  isLocal: boolean;
}

export interface MediaEntity {
  id: string;
  name: string | null;
  type: MediaType;
  creationDate: Date;
  updateDate: Date;
  sourceIds: Array<number>;
  ownerId: string;
}

export class Media implements MediaEntity {
  id!: string;
  name!: string | null;
  type!: MediaType;
  creationDate!: Date;
  updateDate!: Date;
  sourceIds!: number[];
  ownerId!: string;
}

export default MediaEntity;
