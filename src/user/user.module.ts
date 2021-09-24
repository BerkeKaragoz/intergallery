import { AuthenticatedGuard } from './../auth/authenticated.guard';
import { User } from 'src/model/entities/user.entity';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, AuthenticatedGuard],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
