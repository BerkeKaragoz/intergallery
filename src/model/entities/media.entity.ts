import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { SourceEntity } from './source.entity';
import { UserEntity } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum MediaType {
  UNKNOWN = 0,
  PICTURE = 1,
}

@Entity('media')
export class MediaEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: MediaType.UNKNOWN })
  type: MediaType;

  @CreateDateColumn()
  creationDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @RelationId((media: MediaEntity) => media.sources)
  sourceIds: number[];

  @OneToMany(() => SourceEntity, (source) => source.media, {
    cascade: true,
  })
  sources: SourceEntity[];

  @RelationId((media: MediaEntity) => media.owner)
  ownerId: string;

  @ManyToOne(() => UserEntity, (user) => user.mediaList)
  owner: UserEntity;
}
