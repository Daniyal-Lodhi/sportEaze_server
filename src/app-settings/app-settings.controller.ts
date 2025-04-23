import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppSettingsService } from './app-settings.service';
import { UpdateAppSettingDto } from './dto/update-app-setting.dto';
import path from 'path';

@Controller('/api/app-settings')
export class AppSettingsController {
  constructor(private readonly appSettingsService: AppSettingsService) {}

  @Get()
  async getAppSettings()
  {
    return await this.appSettingsService.getAppSettings();
  }

  @Patch()
  async updateAppSettings(@Body() updateAppSettingDto: UpdateAppSettingDto) {
    return await this.appSettingsService.updateAppSettings(updateAppSettingDto);
  }

}
