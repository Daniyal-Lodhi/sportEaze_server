import { PartialType, OmitType, ApiPropertyOptional } from "@nestjs/swagger";
import { RegisterPlayerDto } from "./register-player.dto";
import { IsNumber, IsOptional } from "class-validator";

export class UpdatePlayerDto extends PartialType(
  OmitType(RegisterPlayerDto, ["username"] as const)
)
{
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
