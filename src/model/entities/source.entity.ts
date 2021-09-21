import { Media } from './media.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Source {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  isLocal: boolean;

  @ManyToOne(() => Media, (media) => media.sources)
  media: Media;
}
