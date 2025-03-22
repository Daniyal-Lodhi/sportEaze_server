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
  

    // @ApiProperty({
    //   description: "The city where the user resides.",
    //   example: "Karachi",
    // })
    // @IsString()
    // city: string;
  
    // @ApiProperty({
    //   description: "The country where the user resides.",
    //   example: "Pakistan",
    // })
    // @IsString()
    // country: string;
  
  }  