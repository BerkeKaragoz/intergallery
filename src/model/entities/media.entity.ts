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
import { Source } from './source.entity';
import { User } from './user.entity';

export enum MediaType {
  UNKNOWN = 0,
  PICTURE = 1,
}

@Entity()
export class Media {
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

  @RelationId((media: Media) => media.sources)
  sourceIds: number[];

  @OneToMany(() => Source, (source) => source.media, {
    cascade: true,
  })
  sources: Source[];

  @RelationId((media: Media) => media.owner)
  ownerId: string;

  @ManyToOne(() => User, (user) => user.mediaList)
  owner: User;
}
