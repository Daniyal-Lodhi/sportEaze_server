import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, Request, Response } from '@nestjs/common';
import { SharedPostsService } from './shared-posts.service';
import { CreateSharedPostDto } from './dto/create-shared-post.dto';
import { JwtAuthGuard } from 'src/modules/auth/local-auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateSharedPostDto } from './dto/update-shared-post.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller("api/user/post")
export class SharedPostsController {
  constructor(private readonly sharedPostsService: SharedPostsService) {}

  @Post("/shared-posts")
  async create(@Body() createSharedPostDto: CreateSharedPostDto, @Request() req, @Response() res) {
    try {
       const sharedPost = await this.sharedPostsService.create(req.user.id, createSharedPostDto);

      res.status(201).json({success: true, ...{sharedPost}});
    } catch (error) {
      console.error("[SHARED_POSTS]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }  
  }

  @Get("/shared-posts")
  async get(@Request() req, @Response() res)
  {
    try {
      const sharedPosts = await this.sharedPostsService.getSharedPostsByUserId(req.user.id);

     res.status(200).json({success: true, ...{sharedPosts}});
   } catch (error) {
     console.error("[GET_SHARED_POSTS]:", error);
     throw new HttpException(
       error.message || "Internal Server Error",
       error.status || HttpStatus.INTERNAL_SERVER_ERROR,
     );
   }  
  }

  @Patch("/shared-posts/")
  async update(@Body() updateSharedPost: UpdateSharedPostDto, @Request() req, @Response() res)
  {
    try {
      const updatedSharedPost = await this.sharedPostsService.UpdateSharedPost(req.user.id, updateSharedPost);

     res.status(200).json({success: true, ...{updatedSharedPost}});
   } catch (error) {
     console.error("[GET_SHARED_POSTS]:", error);
     throw new HttpException(
       error.message || "Internal Server Error",
       error.status || HttpStatus.INTERNAL_SERVER_ERROR,
     );
   }  
  }
}
