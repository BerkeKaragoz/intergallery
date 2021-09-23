import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Source } from './source.entity';
import { User } from './user.entity';

export enum MediaType {
  PICTURE = 0,
}

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: MediaType;

  @CreateDateColumn()
  creationDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @OneToMany(() => Source, (source) => source.media)
  sources: Source[];

  @ManyToOne(() => User, (user) => user.mediaList)
  owner: User;
}
