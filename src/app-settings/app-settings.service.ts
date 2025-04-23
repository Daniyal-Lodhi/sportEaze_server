import { Injectable } from '@nestjs/common';
import { UpdateAppSettingDto } from './dto/update-app-setting.dto';

@Injectable()
export class AppSettingsService {

  private appSettings = {
    allowDeleteUser: true,
    allowUpdateUser: true,
    shouldTakeConsent: true,
  };

  async getAppSettings() {
    return this.appSettings;
  }

  async updateAppSettings(updateAppSettingDto: UpdateAppSettingDto) {
    this.appSettings = { ...this.appSettings, ...updateAppSettingDto };

    return this.appSettings;
  }
}
