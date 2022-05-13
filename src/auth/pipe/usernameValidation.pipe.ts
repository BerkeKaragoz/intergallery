import { AuthService } from '../auth.service';
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class UsernameValidationPipe implements PipeTransform {
  constructor(private authService: AuthService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.data === 'username') {
      const user = await this.authService.getUserByUsername(value);

      if (user) {
        throw new BadRequestException('Username is not valid!');
      }
    }
    return value;
  }
}
