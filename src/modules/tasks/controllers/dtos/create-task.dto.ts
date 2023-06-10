import { Expose } from 'class-transformer';
import { MaxLength } from 'class-validator';

export class CreateTaskDto {
  @Expose()
  @MaxLength(2500)
  summary: string;
}
