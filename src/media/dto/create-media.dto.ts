import { UserEntity } from 'src/model/entities/user.entity';
import { SourceEntity } from 'src/model/entities/source.entity';
import { OmitType } from '@nestjs/swagger';

export class CreateMediaDto {
  name: string;
  owner: UserEntity;
  sources: Array<SourceEntity>;
}

export class CreateMediaInputDto extends OmitType(CreateMediaDto, [
  'owner',
] as const) {}
