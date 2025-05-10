import { Module } from '@nestjs/common';
import { AppSettingsService } from './app-settings.service';
import { AppSettingsController } from './app-settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppSettings } from './app-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppSettings])],
  controllers: [AppSettingsController],
  providers: [AppSettingsService],
})
export class AppSettingsModule {}
