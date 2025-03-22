import { Controller, Get, Redirect } from "@nestjs/common";
import { AppService } from "./app.service";
import { ConfigService } from "@nestjs/config";
import { ApiExcludeController } from "@nestjs/swagger";

@ApiExcludeController()
@Controller("/project")
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configS: ConfigService,
  ) {}

  @Get("/architecture")
  @Redirect("https://www.tldraw.com/f/1SWocUy7SNWS7Fgg2oTwk")
  getArchitecture(): string {
    return this.appService.getHello();
  }

  @Get("/design")
  @Redirect("https://www.figma.com/design/FbSXKNiuvmIfHlXj2XYeT5")
  getDesign(): string {
    return this.appService.getHello();
  }
}
