import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FeedService } from './feed.service';
import { OptionalJwtAuthGuard } from '../auth/local-auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('/api/feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @Get("/:pageNo/:pageSize")
  async getNewsFeed(@Request() req, @Param("pageNo") pageNo: number, @Param("pageSize") pageSize: number) {
    return await this.feedService.getNewsFeed(pageNo, pageSize, req.user?.id);
  }

}
