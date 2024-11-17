import { Module } from '@nestjs/common';
import { LocalAuthService } from './local-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';

@Module({
  imports: [
    ConfigModule,  
    JwtModule.registerAsync({
      imports: [ConfigModule],  
      inject: [ConfigService], 
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),  
          signOptions: { expiresIn: '1y' },  
        }
      },
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [],
  providers: [LocalAuthService,JwtStrategy],
  exports: [JwtModule]
})
export class LocalAuthModule { }
