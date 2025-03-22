import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatronService } from './patron.service';
import { CreatePatronDto } from './dto/create-patron.dto';
import { UpdatePatronDto } from './dto/update-patron.dto';

@Controller('patron')
export class PatronController {
  constructor(private readonly patronService: PatronService) {}

  @Post()
  create(@Body() createPatronDto: CreatePatronDto) {
    return this.patronService.create(createPatronDto);
  }

  @Get()
  findAll() {
    return this.patronService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patronService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatronDto: UpdatePatronDto) {
    return this.patronService.update(+id, updatePatronDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patronService.remove(+id);
  }
}
