import { Controller, Get } from '@nestjs/common';
import { SportService } from './sport.service';

@Controller('/api/sport')
export class SportController {
  constructor(private readonly sportService: SportService) {}

  @Get()
  findAll() {
    return this.sportService.getAllSports();
  }
}
