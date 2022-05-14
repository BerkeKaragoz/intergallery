import { MediaEntity } from './media.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('source')
export class SourceEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  isLocal: boolean;

  @ManyToOne(() => MediaEntity, (media) => media.sources, {
    onDelete: 'CASCADE',
  })
  media: MediaEntity;
}
