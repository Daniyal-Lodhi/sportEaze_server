import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum, IsNotEmpty } from "class-validator";
import { ConnectionReqResponse } from "src/common/enums/network/network.enum";

export class RespondConnectionRequestDto {
  @ApiProperty({ description: "ID of the requester", example: "uuid" })
  @IsString()
  @IsNotEmpty()
  requesterId: string;

  @ApiProperty({ description: "Action to take on the request", enum: ConnectionReqResponse, example: ConnectionReqResponse.ACCEPT })
  @IsEnum(ConnectionReqResponse)
  action: ConnectionReqResponse;
}
