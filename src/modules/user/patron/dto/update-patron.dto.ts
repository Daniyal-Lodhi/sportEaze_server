import { OmitType, PartialType } from '@nestjs/swagger';
import { RegisterPatronDto } from './register-patron.dto';

export class UpdatePatronDto extends PartialType(OmitType(RegisterPatronDto, ["username"] as const)) {}
