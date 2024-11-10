import { IsString, IsInt, Min, Max, Length, IsNotEmpty } from 'class-validator';

export class CreateTestUserDto {

    @IsString()
    @Length(1, 50)  
    name: string;

    @IsInt()
    @Min(0)
    @Max(120)  
    age: number;
}
