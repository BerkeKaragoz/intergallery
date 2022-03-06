import { MediaEntity } from "../Media/media";

export interface UserEntity {
  id: string;
  username: string;
  name: string | null;
  creationDate: Date;
  mediaList: MediaEntity[];
}

export interface UserDTO extends Pick<UserEntity, "id" | "username" | "name"> {
  creationDate: string;
}
