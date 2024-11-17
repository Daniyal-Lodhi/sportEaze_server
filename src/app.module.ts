import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
 import { DatabaseModule } from './config/database/database.module';
import { TestModule } from './modules/test/test.module';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { LocalAuthService } from './modules/auth/local-auth/local-auth.service';
import { UserModule } from './modules/user/user.module';
import { LocalAuthModule } from './modules/auth/local-auth/local-auth.module';
import { ConfigModule } from './config/config.module';
import { CookieExtractorMiddleware } from './common/middleware/cookie-extractor.middleware';
import * as cookieParser from 'cookie-parser';




@Module({
  imports: [ 
    ConfigModule,
    DatabaseModule,
    TestModule,
    TypeOrmModule.forFeature([User]) ,
    LocalAuthModule,
    UserModule,

  ],
  controllers: [AppController,UserController],
  providers: [AppService,UserService,LocalAuthService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser(), CookieExtractorMiddleware).forRoutes('*');
}
 }
