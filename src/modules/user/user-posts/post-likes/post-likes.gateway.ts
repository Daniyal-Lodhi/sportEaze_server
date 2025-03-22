import { 
  WebSocketGateway, 
  SubscribeMessage, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ namespace: "post-likes", cors: true })
export class PostLikesGateway implements OnGatewayConnection, OnGatewayDisconnect {  
  @WebSocketServer() server: Server;
  
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  async emitLikePost(postId: string, likeCount: number) {
    this.server.to(postId).emit("likePost", likeCount);
  } 

  @SubscribeMessage("joinPost")
  handleJoinPost(client: Socket, postId: string) {
    client.join(postId);
    console.log(`Client ${client.id} joined post: ${postId}`);
  }

  @SubscribeMessage("leavePost")
  handleLeavePost(client: Socket, postId: string) {
    client.leave(postId);
    console.log(`Client ${client.id} left post: ${postId}`);
  }
}
