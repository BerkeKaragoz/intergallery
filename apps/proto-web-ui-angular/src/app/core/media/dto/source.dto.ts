import { SourceEntity } from "./../media.entity"

export type CreateSourceDTO = Omit<SourceEntity, "id">
