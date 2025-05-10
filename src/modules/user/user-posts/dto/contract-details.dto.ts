import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class ContractDetailsDTO {
    @ApiPropertyOptional({
        description: "The ID of the contract",
        example: null,
    })
    @IsOptional()
    @IsString()
    contractId?: string;

    @ApiPropertyOptional({
        description: "The ID of the milestone",
        example: null,
    })
    @IsOptional()
    @IsString()
    milestoneId?: string;
}