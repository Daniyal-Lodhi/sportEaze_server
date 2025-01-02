import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class CookieExtractorMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const token = req.cookies["access_token"]; // Replace 'access_token' with your cookie name
    if (token) {
      req.headers.authorization = `Bearer ${token}`; // Set as a Bearer token
    }
    next();
  }
}
