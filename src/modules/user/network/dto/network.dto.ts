import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, IsOptional, IsUUID, IsNotEmpty, isNotEmpty } from "class-validator";
import { ConnectionReqResponse } from "src/common/enums/network/network.enum";

// DTO for sending a connection request
export class SendConnectionRequestDto {
  @ApiProperty({ description: "Receiver user ID", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" })
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;
}

// DTO for responding to a connection request
export class RespondToConnectionRequestDto {
  @ApiProperty({ description: "Requester user ID", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" })
  @IsUUID()
  @IsNotEmpty()
  requesterId: string;

  @ApiProperty({ description: "Action to take on the request", example: ConnectionReqResponse.ACCEPT })
  @IsEnum(ConnectionReqResponse)
  @IsNotEmpty()
  action: ConnectionReqResponse;
}
