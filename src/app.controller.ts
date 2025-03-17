import { Controller, Get, Redirect } from "@nestjs/common";
import { AppService } from "./app.service";
import { ConfigService } from "@nestjs/config";
import { ApiExcludeController } from "@nestjs/swagger";

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configS: ConfigService,
  ) {}

  @Get()
  @Redirect("https://www.tldraw.com/f/vsP-0RMcHpxXCmkVYR2MX")
  getHello(): string {
    console.log(this.configS.get("name"));
    return this.appService.getHello();
  }
}
