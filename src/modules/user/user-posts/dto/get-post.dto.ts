import { PostVisibilityEnum } from "src/common/enums/user-posts.enum";
import { PostMediaDTO } from "./post-media.dto";
import { CommentDTO } from "./post-comments.dto";
import { IsNumber, IsString } from "class-validator";
import { ReactTypeEnum } from "src/common/enums/user-posts.enum";

export class GetPostDTO {
  @IsString()
  textContent: string;

  visibility?: PostVisibilityEnum;

  @IsNumber()
  shareCount: number;

  media: PostMediaDTO[];

  // Total count of likes
  @IsNumber()
  likeCount: number;

  // Count breakdown for each reaction type
  reactions: Partial<Record<ReactTypeEnum, number>>;

  commentCount: number;
}
