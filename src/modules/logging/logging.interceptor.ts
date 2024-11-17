import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WinstonLoggerService } from './winston-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: WinstonLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = request;
    const now = Date.now();

    this.logger.log(`Incoming request: ${method} ${url}`);
    this.logger.log(`Request body: ${JSON.stringify(body)}`);
    this.logger.log(`Request headers: ${JSON.stringify(headers)}`);

    return next.handle().pipe(
      tap((response) => {
        this.logger.log(`Request ${method} ${url} took ${Date.now() - now}ms`)
        this.logger.log(`Response: ${JSON.stringify(response)}`)
      })
    );
  }
}
