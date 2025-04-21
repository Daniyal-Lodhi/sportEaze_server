import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PatronAccountStatus } from 'src/common/enums/patron/patron.enum';

export class VerifyPatronDto {
    
    @ApiPropertyOptional({
        description: "The comment or feedback given by the admin during the review process",
        example: "Approved after verifying the documents."
    })
    adminReviewComment?: string;

    @ApiProperty({
        description: "The status of the patron's account after verification",
        enum: PatronAccountStatus,
        example: PatronAccountStatus.APPROVED
    })
    status: PatronAccountStatus;
}
