import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Check, IsNull } from "typeorm";

export class EndorseDto {

    @ApiProperty(
        { description: "player ID", example: "1234567890" }
    )
    @IsString()
    playerId: string;

    @ApiProperty(
        { description: "rating", example: 5 }
    )
    @Check("rating >= 1 AND rating <= 5")
    @IsNumber()
    rating?: number;

    @ApiProperty(
        { description: "review", example: "Great player!" }
    )
    @IsString()
    review: string;
}