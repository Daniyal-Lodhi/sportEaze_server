import {
  Controller,
  Get,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { OptionalJwtAuthGuard } from '../auth/local-auth/jwt-auth.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Feed')
@Controller('/api/feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'pageNo', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size (default: 10)' })
  @Get()
  async getUserFeed(
    @Request() req,
    @Query('pageNo') pageNo = '1',
    @Query('pageSize') pageSize = '10',
  ) {
    const page = parseInt(pageNo, 10);
    const size = parseInt(pageSize, 10);
    const userId = req.user?.id;

    return await this.feedService.getUserFeed(page, size, userId);
  }
}
