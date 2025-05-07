import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  HttpCode, 
  HttpStatus, 
  UseGuards, 
  Req, 
  ForbiddenException, 
  Inject, 
  UnauthorizedException, 
  UploadedFile, 
  BadRequestException, 
  Query,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  UseInterceptors,
  HttpException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { GroupStatus, Member } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
// import { UploadService } from '../modules/uploads/upload.service';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller('groups')
@UseGuards(JwtAuthGuard) // Apply JWT authentication to all endpoints
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    /*private readonly uploadService: UploadService,*/
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
  
  //////////////////////////////////////////////////////
  @Post('upload-banner')
@UseInterceptors(FileInterceptor('file', {
  storage: diskStorage({
    destination: './uploads/banners',
    filename: (req, file, callback) => {
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${extname(file.originalname)}`;
      callback(null, uniqueName);
    }
  }),
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      return callback(new HttpException('Only images are allowed!', HttpStatus.BAD_REQUEST), false);
    }
    callback(null, true);
  }
}))
async uploadGroupBanner(@UploadedFile() file: Express.Multer.File) {
  if (!file) {
    throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
  }

  // Create a proper URL that references your static assets
  const bannerUrl = `/uploads/banners/${file.filename}`;
  
  return {
    message: 'Banner uploaded successfully',
    bannerUrl,
  };
}

@Post()
@UseInterceptors(FileInterceptor('banner'))
async create(
  @Body() createGroupDto: CreateGroupDto,
  @UploadedFile() bannerFile: Express.Multer.File,
  @Req() req: Request
) {
  try {
    console.log('Received banner URL:', createGroupDto.bannerUrl);
    console.log('Starting group creation with file:', bannerFile?.originalname);

    // Get user ID from token
    const userId = await this.getUserIdFromToken(req);

    // Base URL for the banner
    const baseUrl = 'http://localhost:3002'; // OR this.configService.get('SERVER_URL');

    // Handle file upload (inline logic)
    if (bannerFile) {
      const filename = `${bannerFile.filename}`; // assuming Multer saves with unique name
      createGroupDto.bannerUrl = `${baseUrl}/${filename}`;
    }

   // If URL is provided instead
// If URL is provided instead
else if (createGroupDto.bannerUrl) {
  try {
    const processed = await this.groupsService.processBannerUrl(createGroupDto.bannerUrl);
    
    // Check if processed URL already starts with http or /
    if (processed.url.startsWith('http')) {
      createGroupDto.bannerUrl = processed.url;
    } else {
      // Make sure we don't have double slashes
      const urlPath = processed.url.startsWith('/') ? processed.url : `/${processed.url}`;
      createGroupDto.bannerUrl = `${baseUrl}${urlPath}`;
    }
    
    console.log('Final banner URL sent to service:', createGroupDto.bannerUrl);
  } catch (err) {
    console.error('Error processing banner URL:', err);
  }
}

    // Create the group
    const result = await this.groupsService.createGroup(createGroupDto, userId);
    console.log('Final group creation result:', result);

    return result;
  } catch (error) {
    console.error('Error in group creation:', error);
    throw new BadRequestException(`Failed to create group: ${error.message}`);
  }
}

  @Get()
  find(@Query('id') id?: number, @Query('name') name?: string) {
    if (name) {
      return this.groupsService.findMany(name);
    } 
    return this.groupsService.findAll();
  }
  
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      console.log(`Fetching group with ID: ${id}`);
      const group = await this.groupsService.findOne(+id);
      
      // Transform the bannerUrl to include the full frontend URL
      if (group.bannerUrl) {
        group.bannerUrl = this.groupsService.getFullBannerUrl(group.bannerUrl);
      }
      
      console.log('Returning group with final banner URL:', {
        ...group,
        bannerUrl: group.bannerUrl || 'No banner URL'
      });
      
      return group;
    } catch (error) {
      console.error('Error fetching group:', error);
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
  }

  @Patch(':id')
  @UseGuards(GroupAdminGuard)
  async update(@Param('id') id: number, @Body() updateGroupDto: UpdateGroupDto) {
    // If a new bannerUrl is provided in the update, process it
    if (updateGroupDto.bannerUrl) {
      try {
        const processedBanner = await this.groupsService.processBannerUrl(updateGroupDto.bannerUrl);
        updateGroupDto.bannerUrl = processedBanner.url;
      } catch (error) {
        console.error('Error processing banner URL during update:', error);
        // Continue with the update even if banner processing fails
      }
    }
    
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
  @UseGuards(GroupAdminGuard , GroupModeratorGuard)
  addMember(
    @Param('id') id: number,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.groupsService.addMember(+id, addMemberDto);
  }

  @Patch(':id/members')
  @UseGuards(GroupAdminGuard , GroupModeratorGuard)
  updateMember(
    @Param('id') id: number,
    @Body() updateMemberDto: updateMemberDto,
  ) {
    return this.groupsService.updateMember(+id, updateMemberDto);
  }

  @Delete(':groupId/members/:userId')
  @UseGuards(GroupAdminGuard , GroupModeratorGuard)
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
  @UseGuards(GroupAdminGuard , GroupModeratorGuard)
  getPendingRequests(@Param('groupId') groupId: number) {
    return this.groupsService.getPendingRequests(+groupId);
  }

  @Get('requests/user/:userId')
  @UseGuards(GroupAdminGuard , GroupModeratorGuard)
  async getUserRequests(@Param('userId') userId: number, @Req() req: Request) {
    const requestingUserId = await this.getUserIdFromToken(req);
    const requestedUserId = +userId;

    if (requestingUserId !== requestedUserId) {
      throw new ForbiddenException('You can only view your own requests');
    }

    return this.groupsService.getUserRequests(requestedUserId);
  }

  @Patch('requests/:requestId')
  @UseGuards(GroupAdminGuard, GroupModeratorGuard)
  @HttpCode(HttpStatus.OK)
  async handleRequest(
    @Param('requestId') requestId: string,
    @Body('status') status: RequestStatus,
    @Req() req: Request
  ) {
    const adminId = await this.getUserIdFromToken(req);
    return this.groupsService.handleMembershipRequest(+requestId, status, adminId);
  }

  @Patch('requests/:requestId/handle')
  @UseGuards(GroupAdminGuard, GroupModeratorGuard)
  @HttpCode(HttpStatus.OK)
  async handleJoinRequest(
    @Param('requestId') requestId: string,
    @Body('status') status: RequestStatus,
    @Req() req: Request
  ) {
    const adminId = await this.getUserIdFromToken(req);
    return this.groupsService.handleMembershipRequest(+requestId, status, adminId);
  }

  // Block user endpoints
  @Post(':groupId/block')
  @UseGuards(GroupAdminGuard , GroupModeratorGuard)
  async blockUser(@Param('groupId') groupId: string, @Body() blockUserDto: BlockUserDto, @Req() req: Request) {
    const adminId = await this.getUserIdFromToken(req);
    return this.groupsService.blockUser(+groupId, blockUserDto, adminId);
  }

  @Delete(':groupId/block/:userId')
  @UseGuards(GroupAdminGuard , GroupModeratorGuard)
  async unblockUser(@Param('groupId') groupId: string, @Param('userId') userId: string, @Req() req: Request) {
    const adminId = await this.getUserIdFromToken(req);
    return this.groupsService.unblockUser(+groupId, +userId, adminId);
  }

  @Get(':groupId/blocked')
  @UseGuards(GroupAdminGuard , GroupModeratorGuard)
  getBlockedUsers(@Param('groupId') groupId: string) {
    return this.groupsService.getBlockedUsers(+groupId);
  }

  // Invitation endpoints
  @Post(':groupId/invitations')
  async inviteUser(@Param('groupId') groupId: string, @Body() inviteUserDto: InviteUserDto, @Req() req: Request) {
    // Get userId from User Microservice
    const inviterId = await this.getUserIdFromToken(req);

    return this.groupsService.inviteUser(+groupId, inviteUserDto, inviterId);
  }

  @Get(':groupId/invitations')
  @UseGuards(GroupAdminGuard , GroupModeratorGuard)
  getGroupInvitations(@Param('groupId') groupId: string) {
    return this.groupsService.getGroupInvitations(+groupId);
  }

  @Get('invitations/user')
  @UseGuards(GroupAdminGuard , GroupModeratorGuard)
  async getUserInvitations(@Req() req: Request) {
    const userId = await this.getUserIdFromToken(req);
    return this.groupsService.getUserInvitations(userId);
  }

  @Patch('invitations/:invitationId')
  @UseGuards(GroupAdminGuard , GroupModeratorGuard)
  async handleInvitation(@Param('invitationId') invitationId: string, @Body() handleInvitationDto: HandleInvitationDto, @Req() req: Request) {
    const userId = await this.getUserIdFromToken(req);
    return this.groupsService.handleInvitation(+invitationId, handleInvitationDto.status, userId);
  }

  @Post(':groupId/join')
async joinGroup(@Param('groupId') groupId: string, @Req() req: Request) {
  try {
    const userId = await this.getUserIdFromToken(req);
    const group = await this.groupsService.findGroupById(+groupId);

    // Check if user is already a member
    const isMember = await this.groupsService.checkMembership(+groupId, userId);
    if (isMember) {
      throw new ConflictException('User is already a member of this group');
    }

    // Handle based on privacy setting
    if (group.privacy === 'PRIVATE') {
      return this.groupsService.createMembershipRequest(userId, +groupId);
    } else {
      return this.groupsService.addMember(+groupId, {
        userId,
        role: 'MEMBER'
      });
    }
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to process join request');
  }
}

  @Post(':groupId/leave')
  async leaveGroup(@Param('groupId') groupId: string, @Req() req: Request) {
    const userId = await this.getUserIdFromToken(req);
    return this.groupsService.removeMember(+groupId, userId);
  }

  @Get(':groupId/membership/:userId')
  async checkMembership(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string
  ) {
    try {
      const isMember = await this.groupsService.checkMembership(+groupId, +userId);
      return { isMember };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { isMember: false };
      }
      throw new BadRequestException('Failed to check membership status');
    }
  }

  @Get(':groupId/members')
  async getGroupMembers(@Param('groupId') groupId: string) {
    try {
      const members = await this.groupsService.getGroupMembers(+groupId);
      return members;
    } catch (error) {
      throw new NotFoundException(`Could not find members for group ${groupId}`);
    }
  }
  @Get(':groupId/members/:userId')
  async getGroupMember(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string
  ) {
    try {
      const member = await this.groupsService.getGroupMember(+groupId, +userId);
      return member;
    } catch (error) {
      throw new NotFoundException(`Could not find member ${userId} in group ${groupId}`);
    }
  }
}
