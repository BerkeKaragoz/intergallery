import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { SessionEntity } from 'typeorm-store';

@Entity('session')
export class AppSessionEntity extends BaseEntity implements SessionEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  expiresAt: number;

  @Column()
  data: string;
}
