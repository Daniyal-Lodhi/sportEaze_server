import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VerifyPatronDto {
    
    @ApiPropertyOptional({
        description: "The comment or feedback given by the admin during the review process",
        example: "Approved after verifying the documents."
    })
    adminReviewComment?: string;
}
