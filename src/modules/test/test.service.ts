import { Injectable } from '@nestjs/common';
import { CreateTestUserDto } from './dto/test.dto';
import { testUserEntity } from './entities/test.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TestService {
    constructor(@InjectRepository(testUserEntity) private testUserRepository: Repository<testUserEntity>) { }


    async createTestUser(userDto: CreateTestUserDto): Promise<testUserEntity> {
        const user: testUserEntity = new testUserEntity();
        user.name = userDto.name;
        user.age = userDto.age;
        console.log("test user created succesfully")
        return await this.testUserRepository.save(user);
    }
}
