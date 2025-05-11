import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateMilestoneDto {
  @ApiProperty({
    example: 'Design mockups',
    description: 'A short description of the milestone task or goal.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 1000,
    description: 'The amount allocated for this milestone.',
  })
  @IsNumber()
  amount: number;
}



export class UpdateMilestoneDto {

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of milestone.',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'Design mockups',
    description: 'A short description of the milestone task or goal.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 1000,
    description: 'The amount allocated for this milestone.',
  })
  @IsNumber()
  amount: number;
}