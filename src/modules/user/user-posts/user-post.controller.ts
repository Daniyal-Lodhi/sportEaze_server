import { Body, Controller, Post, UseGuards, Request, Response, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/local-auth/jwt-auth.guard';
import { CreateTextPostDTO } from './dto/create-text-post.dto';
import { UserPostService } from './user-post.service';
import { CreateMediaPostDTO } from './dto/create-media-post.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/user/post')
export class UserPostController {

    constructor(private PostSrv:UserPostService){}

    // creating only text user posts
    @Post('/createTextPost')
    async createTextPost(
        @Body() CreateTextPostDTO:CreateTextPostDTO,
        @Request() req,
        @Response() res,
    ){
        try {
            const createdTextPost = await this.PostSrv.createTextPost(req.user.id,CreateTextPostDTO);
             res.status(200).json({"success":true,post:createdTextPost})
        } catch (error) {
            console.error('[CREATE_USER_POST_CTRL]:', error);
            throw new HttpException(error.message || "Internal Server Error", error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


     @Post('/createMediaPost')
    async createMediaPost(
        @Body() CreateMediaPostDTO:CreateMediaPostDTO,
        @Request() req,
        @Response() res,
    ){
        try {
            const createdMediaPost = await this.PostSrv.createMediaPost(req.user.id,CreateMediaPostDTO);
             res.status(200).json({"success":true,post:createdMediaPost})
        } catch (error) {
            console.error('[CREATE_USER_POST_CTRL]:', error);
            throw new HttpException(error.message || "Internal Server Error", error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}
