import { AppSessionEntity } from "./../model/entities/session.entity"
import { SessionSerializer } from "./session.serializer"
import { LocalStrategy } from "./local.stategy"
import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { PassportModule } from "@nestjs/passport"
import { AuthController } from "./auth.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "src/model/entities/user.entity"

@Module({
   imports: [
      PassportModule.register({ session: true }),
      TypeOrmModule.forFeature([AppSessionEntity], "session"),
      TypeOrmModule.forFeature([UserEntity]),
   ],
   providers: [AuthService, LocalStrategy, SessionSerializer],
   controllers: [AuthController],
})
export class AuthModule {}
