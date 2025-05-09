import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { RegisterPatronDto } from './register-patron.dto';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdatePatronDto extends PartialType(OmitType(RegisterPatronDto, ["username"] as const)) {
      @ApiPropertyOptional({
        description: "The total amount in the wallet",
        example: 1000,
        type: "number",
      })
      @IsOptional()
      @IsNumber()
      walletTotal: number;
    
      @ApiPropertyOptional({
        description: "The pending amount in the wallet",
        example: 500,
        type: "number",
      })
      @IsOptional()
      @IsNumber()
      walletPending: number
}
