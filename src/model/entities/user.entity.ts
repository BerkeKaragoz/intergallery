import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Media } from './media.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Media, (media) => media.owner)
  mediaList: Media[];
}
