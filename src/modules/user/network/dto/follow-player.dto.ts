import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class FollowPlayerDto {
  @ApiProperty({ description: "ID of the player to follow", example: "uuid" })
  @IsString()
  @IsNotEmpty()
  playerId: string;
}
