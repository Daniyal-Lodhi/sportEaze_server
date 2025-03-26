import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { Connection } from "./entities/connection.entity";
import { Followers } from "./entities/follower.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ConnectionReqResponse, ConnectionStatus } from "src/common/enums/network/network.enum";
import  {canConnect} from "src/common/utils/network/index";
import { UserType } from "src/common/enums/user/user-type.enum";

@Injectable()
export class NetworkService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Connection) private connectionRepository: Repository<Connection>,
    @InjectRepository(Followers) private followRepository: Repository<Followers>,
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
        { senderId: requester_id, receiverId: receiver_id },
        { senderId: receiver_id, receiverId: requester_id },
      ],
    });

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
      return { message: "Connection request sent.",success:true  };
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
      await this.connectionRepository.save(connection);
      if(action === ConnectionReqResponse.ACCEPT) {
          return { message: `Connection request accepted`,accepted:true };
      }
      else{
        return { message: `Connection request rejected`,accepted:false,success:true  };
      }
    } catch (error) {
      throw new InternalServerErrorException("Failed to update connection request.");
    }
  }

//   get pending connection request
async getPendingConnectionRequests(userId: string) {
    const pendingRequests = await this.connectionRepository.find({
      where: [
        { receiverId: userId, status: ConnectionStatus.PENDING }, // Requests sent to the user
      ],
      relations: ["sender"], // Fetch sender details
    });
  
    if (!pendingRequests.length) {
      throw new NotFoundException("No pending connection requests found.");
    }
  
    return pendingRequests.map((request) => ({
      requestId: request.id,
      userId: request.senderId,
      userName: request.sender.username, // Assuming 'name' exists in User entity
      status: request.status,
      userType:request.sender.userType,
      fullName:request.sender.fullName,
      profilePic:request.sender.profilePicUrl,
      success:true 
    }));
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
  
    return connections.map((connection) => {
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
    return followers.map(follow => follow.follower);
  }
  
  

  
}
