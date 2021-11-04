import MediaEntity from '../media.entity';
import { PaginatedDTO } from './../../api/dto/api.dto';

type UserMediaDTO = PaginatedDTO<Array<MediaEntity>>;

export default UserMediaDTO;
