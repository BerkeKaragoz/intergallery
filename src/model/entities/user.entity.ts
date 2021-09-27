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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false, select: false })
  passwordHash: string;

  @Column({ nullable: true })
  name: string;

  @CreateDateColumn()
  creationDate: Date;

  @OneToMany(() => Media, (media) => media.owner, {
    cascade: true,
  })
  mediaList: Media[];
}
