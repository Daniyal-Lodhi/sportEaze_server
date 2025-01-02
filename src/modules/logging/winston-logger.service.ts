// import { LoggerService, Injectable, LogLevel } from "@nestjs/common";
// import * as winston from "winston";
// import "winston-daily-rotate-file";

// @Injectable()
// export class WinstonLoggerService implements LoggerService {
//   private logger: winston.Logger;

//   constructor() {
//     const logFormat = winston.format.printf(
//       ({ timestamp, level, message, context }) => {
//         return `${timestamp} [${level}] [${context || "NestJS"}]: ${message}`;
//       },
//     );

//     this.logger = winston.createLogger({
//       level: "debug",
//       format: winston.format.combine(
//         winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//         winston.format.colorize({ all: true }),
//         winston.format.errors({ stack: true }),
//         winston.format.splat(),
//         logFormat,
//       ),
//       transports: [
//         new winston.transports.Console(),
//         new winston.transports.File({ filename: "logs/app.log" }),
//         new winston.transports.DailyRotateFile({
//           filename: "logs/%DATE%.log",
//           datePattern: "YYYY-MM-DD",
//           maxFiles: "7d",
//         }),
//       ],
//     });
//   }

//   log(message: any, context?: string) {
//     this.logger.info(message, { context });
//   }

//   error(message: any, trace?: string, context?: string) {
//     this.logger.error(message, { trace, context });
//   }

//   warn(message: any, context?: string) {
//     this.logger.warn(message, { context });
//   }

//   debug(message: any, context?: string) {
//     this.logger.debug(message, { context });
//   }

//   verbose(message: any, context?: string) {
//     this.logger.verbose(message, { context });
//   }

//   setLogLevels(levels: LogLevel[]) {
//     const levelMap = {
//       debug: "debug",
//       verbose: "verbose",
//       warn: "warn",
//       error: "error",
//       log: "info",
//     };
//     this.logger.level = levelMap[levels[0]] || "info";
//   }
// }
