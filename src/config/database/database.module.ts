import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { dbConFail, dbConSuccess } from "src/common/consts/db-const";
import { dataSourceOptions } from "./typeorm.config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (): Promise<TypeOrmModuleOptions> => {
        const config: TypeOrmModuleOptions =
          dataSourceOptions as TypeOrmModuleOptions;

        const dataSource = new DataSource(config as DataSourceOptions);
        try {
          await dataSource.initialize();
          console.log(dbConSuccess);
        } catch (error) {
          console.error(dbConFail, error, "\n\n");
        }

        return config;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
