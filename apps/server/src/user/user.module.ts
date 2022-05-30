import { AuthenticatedGuard } from "./../auth/authenticated.guard"
import { UserEntity } from "src/model/entities/user.entity"
import { UserService } from "./user.service"
import { Module } from "@nestjs/common"
import { UserController } from "./user.controller"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
   imports: [TypeOrmModule.forFeature([UserEntity])],
   providers: [UserService, AuthenticatedGuard],
   exports: [UserService],
   controllers: [UserController],
})
export class UserModule {}
