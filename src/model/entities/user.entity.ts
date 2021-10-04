import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { MediaEntity } from './media.entity';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
@Entity('user')
export class UserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @ApiHideProperty()
  @Column({ nullable: false, select: false })
  passwordHash: string;

  @Column({ nullable: true })
  name: string;

  @CreateDateColumn()
  creationDate: Date;

  @OneToMany(() => MediaEntity, (media) => media.owner, {
    cascade: true,
  })
  mediaList: MediaEntity[];
}
