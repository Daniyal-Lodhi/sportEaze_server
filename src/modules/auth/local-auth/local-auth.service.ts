import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserType } from 'src/common/enums/user-type.enum';
import { verifyPassword } from 'src/common/utils/user-utils';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class LocalAuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,

  ) { }


  getAccessToken(id: string, userType: UserType): string {
    const payload = {
      id,
      userType
    }
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  async verifyPassword(email:string,password:string):Promise<boolean>{
    const user = await this.userRepository.findOne({
      where:{email}
    })

    const validPass:boolean = await verifyPassword(password,user.password);
    return validPass;


  }
}
