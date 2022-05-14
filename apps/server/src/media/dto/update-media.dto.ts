import { UserEntity } from 'src/model/entities/user.entity';
import { SourceEntity } from 'src/model/entities/source.entity';
import { OmitType } from '@nestjs/swagger';
import { MediaEntity } from 'src/model/entities/media.entity';

export class UpdateMediaDto {
  id: MediaEntity['id'];
  name: MediaEntity['name'];
  type: MediaEntity['type'];
  owner: UserEntity;
  addedSources: Array<SourceEntity>;
  deletedSourceIds: Array<SourceEntity['id']>;
}

export class UpdateMediaInputDto extends OmitType(UpdateMediaDto, [
  'owner',
] as const) {}
