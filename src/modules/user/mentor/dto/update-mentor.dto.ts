import { OmitType, PartialType } from '@nestjs/swagger';
import { RegisterMentorDto } from './register-mentor.dto';

export class UpdateMentorDto extends PartialType(OmitType(RegisterMentorDto, ["username"] as const)) {}
