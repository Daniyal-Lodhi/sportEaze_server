import { Controller, Get, Redirect } from "@nestjs/common";
import { AppService } from "./app.service";
import { ConfigService } from "@nestjs/config";
import { ApiExcludeController } from "@nestjs/swagger";

@ApiExcludeController()
@Controller("")
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}
  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get("/project/architecture")
  @Redirect("https://www.tldraw.com/f/1SWocUy7SNWS7Fgg2oTwk")
  getArchitecture(): void { }

  @Get("/project/design")
  @Redirect("https://www.figma.com/design/FbSXKNiuvmIfHlXj2XYeT5")
  getDesign(): void { }
}
