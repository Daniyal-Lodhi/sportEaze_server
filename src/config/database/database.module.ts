import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { dbConFail, dbConSuccess } from 'src/common/consts/db-const';
import { dataSourceOptions } from './typeorm.config';
import { WinstonLoggerService } from 'src/modules/logging/winston-logger.service';



@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (): Promise<TypeOrmModuleOptions> => {
        const config: TypeOrmModuleOptions = dataSourceOptions as TypeOrmModuleOptions
        const logger = new WinstonLoggerService();
        const dataSource = new DataSource(config as DataSourceOptions);
        try {
          await dataSource.initialize();
          logger.log(dbConSuccess);
        } catch (error) {
          logger.error(dbConFail, error,'\n\n');
        }
        
        return config;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
