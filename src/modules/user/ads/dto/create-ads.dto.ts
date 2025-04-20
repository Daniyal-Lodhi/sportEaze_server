// create-sponsored-post.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import {
    IsArray,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    IsUrl,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { MediaType, PostCategoryEnum } from "src/common/enums/post/user-posts.enum";




class MediaItemDTO {
    @ApiProperty({ example: 0 })
    @IsEnum(MediaType)
    mediaType: MediaType;

    @ApiProperty({ example: "https://example.com/media/image1.jpg" })
    @IsUrl()
    mediaLink: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    mediaOrder: number;

    @ApiProperty({ example: "https://example.com/media/thumb1.jpg" })
    @IsString()
    @IsNotEmpty()
    mediaThumbnail: string;
}

class AdContentDTO {
    @ApiProperty({ example: "Check out our new product for athletes!" })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiProperty({ type: [MediaItemDTO] })
    @ValidateNested({ each: true })
    @Type(() => MediaItemDTO)
    @IsArray()
    media: MediaItemDTO[];

    @ApiProperty({ example: "https://example.com/shop-now" })
    @IsUrl()
    @IsNotEmpty()
    cta_link: string;
}





class TargetingDTO {
    @ApiProperty({ example: "18-30" })
    @IsString()
    @IsNotEmpty()
    target_audience_age: string;

    @ApiProperty({ example: [1, 2] })
    @IsArray()
    @IsNotEmpty()
    target_sports_category: number[];

    @ApiProperty({ example: 5000 })
    @IsInt()
    target_reachable_users: number;
}


class BudgetDTO {
    @ApiProperty({ example: 150 })
    @IsInt()
    amount_to_spend: number;

    @ApiProperty({ example: "USD" })
    @IsString()
    @IsNotEmpty()
    currency: string;
}


export class CreateSponsoredPostDTO {
    @ApiProperty({ enum: PostCategoryEnum, example: PostCategoryEnum.SPONSORED_POST })
    @IsEnum(PostCategoryEnum)
    post_type: PostCategoryEnum;

    @ApiProperty({ type: () => AdContentDTO })
    @ValidateNested() 
    @Type(() => AdContentDTO)
    @IsNotEmpty()
    ad_content: AdContentDTO;

    @ApiProperty({ type: () => TargetingDTO })
    @ValidateNested()
    @Type(() => TargetingDTO)
    @IsNotEmpty()
    targeting: TargetingDTO;

    @ApiProperty({ type: () => BudgetDTO })
    @ValidateNested()
    @Type(() => BudgetDTO)
    @IsNotEmpty()
    budget: BudgetDTO;
}

