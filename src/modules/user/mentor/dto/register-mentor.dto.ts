import { BaseUserDto } from "../../dto/base-user.dto";
import { IsEnum, IsOptional, IsString, IsUUID, Length, IsArray, ArrayNotEmpty, IsUrl } from "class-validator";
import { MentorRole } from "src/common/enums/mentor/mentor.enum";
import { Sport } from "src/common/enums/sport/sport.enum";

export class RegisterMentorDto extends BaseUserDto {
    
      @IsUUID()
      id: string;
    
      @IsEnum(MentorRole)
      role: MentorRole;
    
      @IsArray()
      @ArrayNotEmpty()
      @IsEnum(Sport, { each: true })
      sportInterests: Sport[];
    
      @IsString()
      @Length(1, 50)
      yearsOfExperience: string;
    
      @IsOptional()
      @IsString()
      @Length(1, 255)
      currentAffiliation?: string;
    
      @IsOptional()
      @IsUrl()
      website?: string;
    
      @IsOptional()
      @IsUrl()
      linkedIn?: string;
    
      @IsOptional()
      @IsUrl()
      fbLink?: string;
    
      @IsOptional()
      @IsUrl()
      xLink?: string;
    
      @IsOptional()
      @IsUrl()
      instaLink?: string;
    
      @IsOptional()
      @IsArray()
      @IsString({ each: true })
      verificationDocuments?: string[];
    }