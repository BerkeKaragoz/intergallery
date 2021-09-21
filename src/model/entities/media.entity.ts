import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Source } from './source.entity';
import { User } from './user.entity';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: number;

  @OneToMany(() => Source, (source) => source.media)
  sources: Source[];

  @ManyToOne(() => User, (user) => user.mediaList)
  owner: User;
}
