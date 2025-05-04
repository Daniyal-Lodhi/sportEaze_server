import { Injectable } from '@nestjs/common';
import { UpdateAppSettingDto } from './dto/update-app-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AppSettings } from './app-settings.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppSettingsService {
  constructor(@InjectRepository(AppSettings) private appSettingsRepo: Repository<AppSettings>) {} 
  async getAppSettings() {
    return await this.appSettingsRepo.findOne({ 
      where: { id: 1 }, select: {
        allowDeleteUser: true,
        allowUpdateUser: true,
        shouldTakeConsent: true
      }
    });
  }

  async updateAppSettings(updateAppSettingDto: UpdateAppSettingDto) {
    const appSettings = await this.appSettingsRepo.findOne({ where: { id: 1 } });
    
    await this.appSettingsRepo.save({ ...appSettings, ...updateAppSettingDto });

    return await this.getAppSettings();
  }
}
