import { BaseUserDto } from "../../dto/base-user.dto";
import { IsEnum, IsOptional, IsString, IsUUID, Length, IsArray, ArrayNotEmpty, IsUrl } from "class-validator";
import { MentorRole } from "src/common/enums/mentor/mentor.enum";
import { Sport } from "src/common/enums/sport/sport.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterMentorDto extends BaseUserDto {
    @ApiProperty({ description: "Role of the mentor", enum: MentorRole })
    @IsEnum(MentorRole)
    role: MentorRole;
  
    @ApiProperty({ description: "List of sports the mentor is interested in", enum: Sport, isArray: true })
    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(Sport, { each: true })
    sportInterests: Sport[];
  
    @ApiProperty({ description: "Years of experience as a mentor", example: "5" })
    @IsString()
    @Length(1, 50)
    yearsOfExperience: string;
  
    @ApiPropertyOptional({ description: "Current affiliation of the mentor", example: "XYZ Sports Academy" })
    @IsOptional()
    @IsString()
    @Length(1, 255)
    currentAffiliation?: string;
  
    @ApiPropertyOptional({ description: "Website of the mentor", example: "https://example.com" })
    @IsOptional()
    @IsUrl()
    website?: string;
  
    @ApiPropertyOptional({ description: "LinkedIn profile link", example: "https://linkedin.com/in/example" })
    @IsOptional()
    @IsUrl()
    linkedIn?: string;
  
    @ApiPropertyOptional({ description: "Facebook profile link", example: "https://facebook.com/example" })
    @IsOptional()
    @IsUrl()
    fbLink?: string;
  
    @ApiPropertyOptional({ description: "X (Twitter) profile link", example: "https://twitter.com/example" })
    @IsOptional()
    @IsUrl()
    xLink?: string;
  
    @ApiPropertyOptional({ description: "Instagram profile link", example: "https://instagram.com/example" })
    @IsOptional()
    @IsUrl()
    instaLink?: string;
  
    @ApiPropertyOptional({ description: "List of document URLs for verification", example: ["https://example.com/doc1.pdf", "https://example.com/doc2.pdf"] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    verificationDocuments?: string[];

    @ApiProperty({ description: "Bio of the mentor", example: "Experienced mentor with a passion for sports." })
    @IsString()
    bio: string;

    @ApiProperty({ description: "Primary sport of the mentor", enum: Sport, example: Sport.FOOTBALL })
    @IsEnum(Sport)
    primarySport: Sport;
}
