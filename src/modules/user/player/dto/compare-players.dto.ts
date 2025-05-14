import {
  IsString,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { User } from "src/modules/user/entities/user.entity";

@ValidatorConstraint({ name: "IsDifferentUsernames", async: false })
class IsDifferentUsernamesConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const dto = args.object as ComparePlayersDto;
    return dto.playerOneUsername !== dto.playerTwoUsername;
  }

  defaultMessage(args: ValidationArguments) {
    return "playerOneUsername and playerTwoUsername must not be the same.";
  }
}

export class ComparePlayersDto {
  @ApiProperty({
    description: "Username of the first player to compare",
    example: "playerOne",
  })
  @IsString()
  readonly playerOneUsername: string;

  @ApiProperty({
    description: "Username of the second player to compare",
    example: "playerTwo",
  })
  @IsString()
  @Validate(IsDifferentUsernamesConstraint)
  readonly playerTwoUsername: string;

  @ApiProperty({
    description: "User entity associated with the comparison",
    type: () => User,
  })
  @ValidateNested()
  @Type(() => User)
  readonly user: User;
}