import {
    IsEnum,
  } from "class-validator";
  import { ApiProperty } from "@nestjs/swagger";
  import { Sport } from "src/common/enums/sport/sport.enum";
import { BaseUserDto } from "./base-user.dto";
  
  
  export class RegisterUserDto extends BaseUserDto {

    @ApiProperty({
      description: "The sports that the user is interested in.",
      example: [Sport.FOOTBALL, Sport.CRICKET],
      required: false,
      isArray: true,
      enum: Sport,
    })
    @IsEnum(Sport, { each: true })
    sportInterests: Sport[];
    }  