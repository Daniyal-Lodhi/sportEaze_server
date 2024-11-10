import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { dbConFail, dbConSuccess } from 'src/common/consts/db-const';
import { testUserEntity } from 'src/modules/test/entities/test.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        const config: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get<string>('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get<string>('POSTGRES_USER'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DB'),
          schema: configService.get<string>('POSTGRES_SCHEMA'), 
          entities: [__dirname + '/../**/*.entity{.ts,.js}',testUserEntity],
          synchronize: true,
        };

        // Cast config to DataSourceOptions for manual initialization
        const dataSource = new DataSource(config as DataSourceOptions);
        try {
          await dataSource.initialize();
          console.log(dbConSuccess);
        } catch (error) {
          console.error(dbConFail, error,'\n\n');
        }
        
        return config;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
