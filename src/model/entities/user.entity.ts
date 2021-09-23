import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Media } from './media.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column()
  name: string;

  @CreateDateColumn()
  creationDate: Date;

  @OneToMany(() => Media, (media) => media.owner)
  mediaList: Media[];
}
