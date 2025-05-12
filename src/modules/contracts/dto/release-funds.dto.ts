import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ReleaseFundsDto { 
    @ApiProperty()
    @IsString()
    playerId: string;
    
    @ApiProperty()
    @IsString()
    milestoneId: string;
}