import { MediaEntity } from 'src/model/entities/media.entity';
import { APaginatedDTO, IPaginatedDTO } from 'src/core/dto/paginated.dto';

export class UserMediaDTO
  extends APaginatedDTO
  implements IPaginatedDTO<MediaEntity[]>
{
  data: MediaEntity[];

  constructor(
    data: MediaEntity[],
    total: number,
    page: number,
    perPage: number,
  ) {
    super(total, page, perPage);
    this.data = data;
  }
}
