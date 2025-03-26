import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class SendConnectionRequestDto {
  @ApiProperty({ description: "ID of the receiver", example: "uuid" })
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  
}
