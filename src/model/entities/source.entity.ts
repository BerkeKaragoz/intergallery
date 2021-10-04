import { MediaEntity } from './media.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('source')
export class SourceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  isLocal: boolean;

  @ManyToOne(() => MediaEntity, (media) => media.sources, {
    onDelete: 'CASCADE',
  })
  media: MediaEntity;
}
