export interface UserEntity {
   id: string
   username: string
   name: string | null
   creationDate: string
}

export class User implements UserEntity {
   id: string
   username: string
   name: string | null
   creationDate: string

   constructor(id = "", username = "", name = "", creationDate = "") {
      this.id = id
      this.username = username
      this.name = name
      this.creationDate = creationDate
   }
}

export type UserIdentification = {
   id: string
   password: string
}

export type UserAuth = {
   username: string
   password: string
}

export default UserEntity
