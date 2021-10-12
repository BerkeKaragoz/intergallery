export type UserEntity = {
  id: string;
  username: string;
  name: string | null;
  creationDate: string;
};

export type UserIdentification = {
  id: string;
  password: string;
};

export default UserEntity;
