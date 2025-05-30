import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { In, Not, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { Connection } from "./entities/connection.entity";
import { Followers } from "./entities/follower.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ConnectionReqResponse, ConnectionStatus } from "src/common/enums/network/network.enum";
import  {canConnect} from "src/common/utils/network/index";
import { UserType } from "src/common/enums/user/user-type.enum";
import { UUID } from "crypto";
import { NetworkSocketHandler } from "./network.socket.handler";
import { NotificationsService } from "src/modules/notifications/notifications.service";
import { NotificationType } from "src/common/enums/notifications/notifications.enum";

@Injectable()
export class NetworkService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Connection) private connectionRepository: Repository<Connection>,
    @InjectRepository(Followers) private followRepository: Repository<Followers>,
    private readonly networkSocketHandler: NetworkSocketHandler,
    private readonly notificationService: NotificationsService,
  ) {}

//   sent connection request
  async sendConnectionRequest(requester_id: string, receiver_id: string) {
    if (requester_id === receiver_id) {
      throw new ConflictException("You cannot connect with yourself.");
    }

    // 1. Validate Users
    const requester = await this.userRepository.findOne({ where: { id: requester_id } });
    const receiver = await this.userRepository.findOne({ where: { id: receiver_id } });

    if (!requester) {
      throw new NotFoundException("Requester user not found.");
    }
    if (!receiver) {
      throw new NotFoundException("Receiver user not found.");
    }

    console.log(requester.userType, receiver.userType)

    // 2. Validate Connection Rules
    if (!canConnect(requester.userType, receiver.userType)) {
      throw new UnauthorizedException("These roles cannot form a connection.");
    }

    // 3. Check if a connection already exists
    const existingConnection = await this.connectionRepository.findOne({
      where: [
        { senderId: requester_id, receiverId: receiver_id, status: Not(ConnectionStatus.REJECTED) },
        { senderId: receiver_id, receiverId: requester_id, status: Not(ConnectionStatus.REJECTED) },
      ],
    });

    console.log(existingConnection, requester_id, receiver_id);

    if (existingConnection) {
      throw new ConflictException("Connection request already exists.");
    }

    // 4. Create Connection Request
    const newConnection = this.connectionRepository.create({
      senderId: requester_id,
      receiverId: receiver_id,
      status: ConnectionStatus.PENDING,
    });

    try {
      await this.connectionRepository.save(newConnection);
      const connection = { id: newConnection.id, status: newConnection.status, receiverId: newConnection.receiverId };

      this.networkSocketHandler.HandleConnectionRequest(requester_id, receiver_id, connection);

      this.notificationService.create(requester_id, {type: NotificationType.CONNECTION_REQUEST, recipientUserId: receiver_id}, requester_id);

      return { message: "Connection request sent.", success:true, connection };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Failed to send connection request.");
    }
  }

//    action to connection request
  async respondToConnectionRequest(requesterId: string, receiverId: string, action: ConnectionReqResponse) {
    // Validate connection request
    const connection = await this.connectionRepository.findOne({
      where: { senderId: requesterId, receiverId: receiverId, status: ConnectionStatus.PENDING },
    });

    if (!connection) {
      throw new NotFoundException("No pending connection request found.");
    }

    if (action === ConnectionReqResponse.ACCEPT) {
      connection.status = ConnectionStatus.ACCEPTED;
    } else if (action === ConnectionReqResponse.REJECT) {
      connection.status = ConnectionStatus.REJECTED;
    } else {
      throw new Error("Invalid action. Use ACCEPT or REJECT.");
    }

    try {
      const isAccepted = action === ConnectionReqResponse.ACCEPT;

      if (isAccepted) {
        await this.connectionRepository.save(connection);
        this.notificationService.create(receiverId, {type: NotificationType.CONNECTION_ACCEPTED, recipientUserId: requesterId}, receiverId);
      } else {
        await this.connectionRepository.remove(connection);
      }
      
      this.networkSocketHandler.HandleConnectionRespond(receiverId, requesterId, connection);
      
      return {
        message: `Connection request ${isAccepted ? 'accepted' : 'rejected'}`,
        accepted: isAccepted,
        success: !isAccepted || undefined
      };
      

    } catch (error) {
      throw new InternalServerErrorException("Failed to update connection request.");
    }
  }

//   get pending connection request
async getPendingConnectionRequests(userId: string) {
    const pendingRequests = await this.connectionRepository.find({
      where: [
        { receiverId: userId, status: ConnectionStatus.PENDING }, // Requests sent to the user
        // { senderId: userId, status: ConnectionStatus.PENDING }, // Requests sent to the user
      ],
      relations: ["sender"], // Fetch sender details
    });
  
    if (!pendingRequests.length) {
     return [];
    }
    
    return pendingRequests.map((request) => ({
      requestId: request.id,
      status: request.status,
      user: {
        id: request.senderId,
        profilePicUrl:request.sender.profilePicUrl,
        fullName:request.sender.fullName,
        username: request.sender.username,
        userType:request.sender.userType,
      }}));
  }

  // get a user's connection
  async getApprovedConnections(userId: string) {
    const connections = await this.connectionRepository.find({
      where: [
        { senderId: userId, status: ConnectionStatus.ACCEPTED },
        { receiverId: userId, status: ConnectionStatus.ACCEPTED },
      ],
      relations: ["sender", "receiver"],
    });
  
    const totalConnectionCount = connections.length;
  
    const userConnections = connections.map((connection) => {
      const otherUser =
        connection.senderId === userId ? connection.receiver : connection.sender;
  
      return {
        id: otherUser.id,
        username: otherUser.username,
        fullName: otherUser.fullName,
        profilePicUrl: otherUser.profilePicUrl,
        userType: otherUser.userType,
      };
    });
  
    return {
      totalConnectionCount,
      connections: userConnections,
    };
  }
  
  

//   to follow a player
async followPlayer(followerId: string, playerId: string) {
    // Validate Users
    const follower = await this.userRepository.findOne({ where: { id: followerId } });
    const player = await this.userRepository.findOne({ where: { id: playerId } });
  
    if (!follower) {
      throw new NotFoundException("Follower user not found.");
    }
    if (!player) {
      throw new NotFoundException("Player user not found.");
    }
  
    // Check if follower is allowed to follow
    if (follower.userType === UserType.PLAYER) {
      throw new UnauthorizedException("Players cannot follow anyone.");
    }
  
    // Ensure target user is a Player
    if (player.userType !== UserType.PLAYER) {
      throw new ConflictException("You can only follow Players.");
    }
  
    // Check if already following
    const existingFollow = await this.followRepository.findOne({
      where: { followerId, playerId },
    });
  
    if (existingFollow) {
      throw new ConflictException("You are already following this player.");
    }
  
    // Create a new follow entry
    const newFollow = this.followRepository.create({
      followerId,
      playerId,
    });
  
    try {
      await this.followRepository.save(newFollow);
      this.notificationService.create(followerId, {type: NotificationType.FOLLOW, recipientUserId: playerId}, followerId);
      return { message: "Successfully followed the player.",success:true  };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Failed to follow player.");
    }
  }
  

//    unfollow a player
async unfollowPlayer(followerId: string, playerId: string) {
    // Validate Users
    const follower = await this.userRepository.findOne({ where: { id: followerId } });
    const player = await this.userRepository.findOne({ where: { id: playerId } });
  
    if (!follower) {
      throw new NotFoundException("Follower user not found.");
    }
    if (!player) {
      throw new NotFoundException("Player user not found.");
    }
  
    // Ensure target user is a Player
    if (player.userType !== UserType.PLAYER) {
      throw new ConflictException("You can only unfollow Players.");
    }
  
    // Check if the follow entry exists
    const existingFollow = await this.followRepository.findOne({
      where: { followerId, playerId },
    });
  
    if (!existingFollow) {
      throw new NotFoundException("You are not following this player.");
    }
  
    // Remove the follow entry
    try {
      await this.followRepository.remove(existingFollow);
      return { message: "Successfully unfollowed the player.",success:true  };
    } catch (error) {
      throw new InternalServerErrorException("Failed to unfollow player.");
    }
  }

  async getFollowers(userId: string) {
    const followers = await this.followRepository.find({
      where: { playerId: userId },
      relations: ["follower"],
    });
  
    // Extract only the follower details
    return followers.map(follow => ({
      id: follow.follower.id,
      profilePicUrl: follow.follower.profilePicUrl,
      fullName: follow.follower.fullName,
      username: follow.follower.username,
      userType: follow.follower.userType,
  }));
  }
  
  
  async isUserFollowingUser(userId1: string, userId2: string)
  {
    return !!(await this.followRepository.findOne({where: {
      followerId: userId1,
      playerId: userId2,
    }}));
  }

  async getConnectionStatusBetweenUsers(userId1: string, userId2: string): Promise<{id: string, status: ConnectionStatus, receiverId: string}> {
    const connection = await this.connectionRepository.findOne({
      where: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
      select: ["id", "status", "receiverId"],
    });
    
    // console.log(connection, userId1, userId2);
    return connection ?? { id: undefined, status: ConnectionStatus.REJECTED, receiverId: undefined };
  }
  
  
  async getFollowersCount(userId: string): Promise<number> {
    return await this.followRepository.count({
      where: [{ playerId: userId }, { followerId: userId }],
    });
  }

  async getConnectionsCount(userId: string): Promise<number> {
    return await this.connectionRepository.count({
      where: [
        { receiverId: userId, status: ConnectionStatus.ACCEPTED },
        { senderId: userId, status: ConnectionStatus.ACCEPTED },
      ]
    });
  }

  async getPendingConnectionsCount(userId: string): Promise<number> {
    return await this.connectionRepository.count({
      where: [
        { receiverId: userId, status: ConnectionStatus.PENDING },
      ]
    });
  }

  async getFollowing(userId: string): Promise<{ id: string }[]> {
    const following = await this.followRepository.find({
      where: {
        followerId: userId,
      },
      select: ["playerId"],
      relations: ["player"],
    });
  
    return following.map(follow => ({ 
      id: follow.playerId,
      userType: follow.player.userType,
      profilePicUrl: follow.player.profilePicUrl,
      fullName: follow.player.fullName,
      username: follow.player.username 
    }));
  }

  async getConnections(userId: string): Promise<{ id: string }[]> {
    const connections = await this.connectionRepository.find({
      where: [
        { senderId: userId, status: ConnectionStatus.ACCEPTED },
        { receiverId: userId, status: ConnectionStatus.ACCEPTED },
      ],
      select: ["senderId", "receiverId"],
    });
  
    const connectedIds = connections.map(connection => {
      return connection.senderId === userId ? connection.receiverId : connection.senderId;
    });
  
    return connectedIds.map(id => ({ id }));
  }

  async deleteConnection(connectionId: string, userId: string) {
    const connection = await this.connectionRepository.findOne({
      where: [
        { senderId: connectionId, receiverId: userId },
        { senderId: userId, receiverId: connectionId },
      ],
    });
  
    if (!connection) {
      throw new NotFoundException("Connection not found.");
    }
  
    // Check if the user is either the sender or receiver
    if (connection.senderId !== userId && connection.receiverId !== userId) {
      throw new UnauthorizedException("You are not authorized to delete this connection.");
    }
  
    try {
      await this.connectionRepository.remove(connection);
      return { message: "Connection deleted successfully.", success: true };
    } catch (error) {
      throw new InternalServerErrorException("Failed to delete connection.");
    }
  }
  
}
