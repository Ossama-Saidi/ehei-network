import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req, ForbiddenException, Inject, UnauthorizedException, UploadedFile, BadRequestException, Query } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { RequestStatus } from './enums/request-status.enum';
import { AddMemberDto } from './dto/add-member.dto';
import { updateMemberDto } from './dto/update-member.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GroupAdminGuard } from '../auth/group-admin.guard';
import { GroupModeratorGuard } from '../auth/group-moderator.guard';
import { GroupMemberGuard } from '../auth/group-member.guard';
import { BlockUserDto } from './dto/block-user.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { HandleInvitationDto } from './dto/handle-invitation.dto';
import { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { GroupStatus } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('groups')
@UseGuards(JwtAuthGuard) // Apply JWT authentication to all endpoints
export class GroupsController {
  constructor(private readonly groupsService: GroupsService,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  // Helper function to verify JWT and get userId
  private async getUserIdFromToken(req: Request): Promise<number> {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw new UnauthorizedException('No authentication token provided');
    }

    const token = authHeader.split(' ')[1]; // Extract Bearer token
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const response = await fetch("http://localhost:3001/user/profil/jwt",{
        method:"GET",
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      const userId = data.data.id;
      // return await this.userServiceClient.send({ cmd: 'verify_jwt' }, { token }).toPromise();
      return userId

    } catch (error) {
      console.error('Error verifying token:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
  
  @Post()
  async create(@Body() createGroupDto: CreateGroupDto, @Req() req: Request, @UploadedFile() bannerFile?: Express.Multer.File) {
   
    const userId = await this.getUserIdFromToken(req);
    createGroupDto.createdBy = userId;
    return this.groupsService.create(createGroupDto, bannerFile);
  }

 @Get()
find(@Query('id') id?: number, @Query('name') name?: string) {
  if (id) {
    return this.groupsService.findGroupById(Number(id));
  } else if (name) {
    return this.groupsService.findMany(name);
  } else {
    return this.groupsService.findAll();
  }
}


  @Patch(':id')
  @UseGuards(GroupAdminGuard)
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(+id, updateGroupDto);
  }

  @Patch(':id/archive')
  @UseGuards(GroupAdminGuard)
  archiveGroup(@Param('id') id: number) {
    return this.groupsService.archiveGroup(+id);
  }

  @Patch(':id/active')
  @UseGuards(GroupAdminGuard)
  activeGroup(@Param('id') id: number) {
    return this.groupsService.activeGroup(+id);
  }

  @Post(':id/members')
  @UseGuards(GroupAdminGuard)
  @UseGuards(GroupModeratorGuard)
  addMember(
    @Param('id') id: number,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.groupsService.addMember(+id, addMemberDto);
  }

  @Patch(':id/members')
  @UseGuards(GroupAdminGuard)
  @UseGuards(GroupModeratorGuard)
  updateMember(
    @Param('id') id: number,
    @Body() updateMemberDto: updateMemberDto,
  ) {
    return this.groupsService.updateMember(+id, updateMemberDto);
  }

  @Delete(':groupId/members/:userId')
  @UseGuards(GroupAdminGuard)
  @UseGuards(GroupModeratorGuard)
  removeMember(
    @Param('groupId') groupId: number,
    @Param('userId') userId: number,
  ) {
    return this.groupsService.removeMember(+groupId, +userId);
  }

  @Post(':groupId/requests')
  async createRequest(@Param('groupId') groupId: number, @Req() req: Request) {
    const userId = await this.getUserIdFromToken(req);
    return this.groupsService.createMembershipRequest(userId, +groupId);
  }

  @Get(':groupId/requests/pending')
  @UseGuards(GroupAdminGuard)
  @UseGuards(GroupModeratorGuard)
  getPendingRequests(@Param('groupId') groupId: number) {
    return this.groupsService.getPendingRequests(+groupId);
  }

  @Get('requests/user/:userId')
  async getUserRequests(@Param('userId') userId: number, @Req() req: Request) {
    const requestingUserId = await this.getUserIdFromToken(req);
    const requestedUserId = +userId;

    if (requestingUserId !== requestedUserId) {
      throw new ForbiddenException('You can only view your own requests');
    }

    return this.groupsService.getUserRequests(requestedUserId);
  }

  @Patch('requests/:requestId')
  @UseGuards(GroupAdminGuard)
  @UseGuards(GroupModeratorGuard)
  @HttpCode(HttpStatus.OK)
  handleRequest(
    @Param('requestId') requestId: string,
    @Body('status') status: RequestStatus,
  ) {
    return this.groupsService.handleMembershipRequest(+requestId, status);
  }

  // Block user endpoints
  @Post(':groupId/block')
  @UseGuards(GroupAdminGuard)
  @UseGuards(GroupModeratorGuard)
  async blockUser(@Param('groupId') groupId: string, @Body() blockUserDto: BlockUserDto, @Req() req: Request) {
    const adminId = await this.getUserIdFromToken(req);
    return this.groupsService.blockUser(+groupId, blockUserDto, adminId);
  }

  @Delete(':groupId/block/:userId')
  @UseGuards(GroupAdminGuard)
  @UseGuards(GroupModeratorGuard)
  async unblockUser(@Param('groupId') groupId: string, @Param('userId') userId: string, @Req() req: Request) {
    const adminId = await this.getUserIdFromToken(req);
    return this.groupsService.unblockUser(+groupId, +userId, adminId);
  }

  @Get(':groupId/blocked')
  @UseGuards(GroupAdminGuard)
  @UseGuards(GroupModeratorGuard)
  getBlockedUsers(@Param('groupId') groupId: string) {
    return this.groupsService.getBlockedUsers(+groupId);
  }

  // Invitation endpoints
  @Post(':groupId/invitations')
  @UseGuards(GroupMemberGuard)
  @UseGuards(GroupAdminGuard)
  @UseGuards(GroupModeratorGuard) 
  async inviteUser(@Param('groupId') groupId: string, @Body() inviteUserDto: InviteUserDto, @Req() req: Request) {
    // Get userId from User Microservice
    const inviterId = await this.getUserIdFromToken(req);

    return this.groupsService.inviteUser(+groupId, inviteUserDto, inviterId);
  }

  @Get(':groupId/invitations')
  @UseGuards(GroupAdminGuard)
  @UseGuards(GroupModeratorGuard)
  getGroupInvitations(@Param('groupId') groupId: string) {
    return this.groupsService.getGroupInvitations(+groupId);
  }

  @Get('invitations/user')
  async getUserInvitations(@Req() req: Request) {
    const userId = await this.getUserIdFromToken(req);
    return this.groupsService.getUserInvitations(userId);
  }

  @Patch('invitations/:invitationId')
  @UseGuards(GroupAdminGuard)
  @UseGuards(GroupModeratorGuard)
  async handleInvitation(@Param('invitationId') invitationId: string, @Body() handleInvitationDto: HandleInvitationDto, @Req() req: Request) {
    const userId = await this.getUserIdFromToken(req);
    return this.groupsService.handleInvitation(+invitationId, handleInvitationDto.status, userId);
  }
}