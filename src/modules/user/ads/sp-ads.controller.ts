import { Controller, HttpException, HttpStatus, UseGuards,  Get, Post, Body, Patch, Param, Delete, Request, Response } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/local-auth/jwt-auth.guard";
import { SponsoredPostService } from "./sp-ads.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateSponsoredPostDTO } from "./dto/create-ads.dto";



@ApiTags("Sponsored Posts")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller("api/ads")
export class SponsoredPostsController {

    constructor(private readonly sponsoredPostService: SponsoredPostService) { }


    @Post("/submit")
    async createSponsoredPost(@Request() req, @Body() body: CreateSponsoredPostDTO, @Response() res) {
        try {
            const userId = req.user.id;
            const sponsoredPost = await this.sponsoredPostService.createSponsoredPost(userId, body);

            return res.status(201).json({
                success: true,
                message: "Sponsored post created successfully",
                data: sponsoredPost,
            });
        } catch (error) {
            console.error("[SPONSORED_POST_CONTROLLER]:", error);
            throw new HttpException(
                error.message || "Internal Server Error",
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

}
