import { Injectable } from '@nestjs/common';
import { CreatePatronDto } from './dto/create-patron.dto';
import { UpdatePatronDto } from './dto/update-patron.dto';

@Injectable()
export class PatronService {
  create(createPatronDto: CreatePatronDto) {
    return 'This action adds a new patron';
  }

  findAll() {
    return `This action returns all patron`;
  }

  findOne(id: number) {
    return `This action returns a #${id} patron`;
  }

  update(id: number, updatePatronDto: UpdatePatronDto) {
    return `This action updates a #${id} patron`;
  }

  remove(id: number) {
    return `This action removes a #${id} patron`;
  }
}
