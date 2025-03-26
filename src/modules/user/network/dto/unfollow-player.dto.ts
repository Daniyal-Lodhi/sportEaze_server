import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class UnfollowPlayerDto {
  @ApiProperty({ description: "ID of the player to unfollow", example: "uuid" })
  @IsString()
  @IsNotEmpty()
  playerId: string;
}
