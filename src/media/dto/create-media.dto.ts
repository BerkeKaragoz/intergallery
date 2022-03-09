import { UserEntity } from 'src/model/entities/user.entity';
import { SourceEntity } from 'src/model/entities/source.entity';
import { OmitType } from '@nestjs/swagger';
import { MediaEntity } from 'src/model/entities/media.entity';

export class CreateMediaDto {
  name: MediaEntity['name'];
  type: MediaEntity['type'];
  owner: UserEntity;
  sources: Array<SourceEntity>;
}

export class CreateMediaInputDto extends OmitType(CreateMediaDto, [
  'owner',
] as const) {}
