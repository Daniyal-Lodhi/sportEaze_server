import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsDateString, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { ContractStatus } from 'src/common/enums/contracts/contracts.enum';
import { UpdateMilestoneDto } from './create-milestone.dto';

export class UpdateContractDto {

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of player for the contract.',
  })
  @IsString()
  playerId: string;

  @ApiProperty({
    example: 'Website development project',
    description: 'A brief summary of the contract\'s purpose or scope.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 5000,
    description: 'The total monetary value of the contract.',
  })
  @IsNumber()
  totalAmount: number;

    @ApiProperty({
        description: "The end date in ISO 8601 format.",
        example: "2027-05-20",
        format: "date",
      })
      @IsDateString()
  endDate: Date;

  @ApiProperty({
    enum: ContractStatus,
    example: ContractStatus.PENDING,
    description: 'Current status of the contract.',
  })
  @IsEnum(ContractStatus)
  status: ContractStatus;

  @ApiProperty({
    type: [UpdateMilestoneDto],
    description: 'A list of milestones associated with the contract.',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMilestoneDto)
  milestones: UpdateMilestoneDto[];
 }
