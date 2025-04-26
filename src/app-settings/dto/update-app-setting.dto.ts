import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateAppSettingDto {
    @ApiProperty({
        description: 'Specifies if users are allowed to be deleted',
        example: true,
    })
    @IsBoolean()
    allowDeleteUser: boolean;
    
    @ApiProperty({
        description: 'Specifies if users are allowed to update their information',
        example: true,
    })
    @IsBoolean()
    allowUpdateUser: boolean;
    
    @ApiProperty({
        description: 'Specifies if the system should take user consent',
        example: false,
    })
    @IsBoolean()
    shouldTakeConsent: boolean;
}
