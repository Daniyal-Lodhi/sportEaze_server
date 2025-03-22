import { PartialType } from '@nestjs/swagger';
import { CreatePatronDto } from './create-patron.dto';

export class UpdatePatronDto extends PartialType(CreatePatronDto) {}
