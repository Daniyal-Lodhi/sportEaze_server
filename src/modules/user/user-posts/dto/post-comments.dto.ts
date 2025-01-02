import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CommentDTO {
  @IsUUID()
  @IsOptional()
  userId: string;

  @IsUUID()
  @IsOptional()
  postId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
