import { Length } from "class-validator"
export class CreateUserDto {
   @Length(4, 25)
   username: string
   @Length(4, 35)
   password: string
}
