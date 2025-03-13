import { 
  WebSocketGateway, 
  SubscribeMessage, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ namespace: "post-comments", cors: true })
export class PostCommentsGateway implements OnGatewayConnection, OnGatewayDisconnect {  
  @WebSocketServer() server: Server;
  
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  async emitNewComment(postId: string, comment: any) {
    this.server.to(postId).emit("newComment", comment);
  }

  async emitEditComment(commentId: string, updatedContent: string) {
    this.server.emit("editComment", { commentId, updatedContent });
  }

  async emitDeleteComment(commentId: string) {
    this.server.emit("deleteComment", { commentId });
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
