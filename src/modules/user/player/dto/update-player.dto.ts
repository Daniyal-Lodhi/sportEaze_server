import { PartialType, OmitType } from "@nestjs/swagger";
import { RegisterPlayerDto } from "./register-player.dto";

export class UpdatePlayerDto extends PartialType(
  OmitType(RegisterPlayerDto, ["username"] as const)
) {}
