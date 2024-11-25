import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { envFilePath } from "./env.config";

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // Make the configuration globally available
      envFilePath, // Path to your .env file
    }),
  ],
  exports: [NestConfigModule], // Export the ConfigModule to make it available in other modules
})
export class ConfigModule {}
