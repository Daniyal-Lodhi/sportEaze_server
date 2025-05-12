import { IsString } from "class-validator";

export class ReleaseFundsDto { 
    @IsString()
    playerId: string;

    @IsString()
    milestoneId: string;
}