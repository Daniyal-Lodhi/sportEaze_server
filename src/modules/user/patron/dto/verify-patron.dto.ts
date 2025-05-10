import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { PatronAccountStatus } from 'src/common/enums/patron/patron.enum';

export class VerifyPatronDto {
    
    @ApiPropertyOptional({
        description: "The comment or feedback given by the admin during the review process",
        example: "Approved after verifying the documents."
    })
    @IsString()
    adminReviewComment?: string;
    
    @ApiProperty({
        description: "The status of the patron's account after verification",
        enum: PatronAccountStatus,
        example: PatronAccountStatus.APPROVED
    })
    @IsEnum(PatronAccountStatus)
    status: PatronAccountStatus;
}
