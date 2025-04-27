import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, BadRequestException, ForbiddenException, forwardRef, Inject} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestStatus } from './enums/request-status.enum';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { updateMemberDto } from './dto/update-member.dto';
import { GroupStatus } from './enums/group-status.enum';
import { BlockUserDto } from './dto/block-user.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { CreatePostDto } from './dto/CreatePost.dto';
// import { UploadService } from 'src/modules/uploads/upload.service';
import { GroupsGateway } from './groups.gateway'; 
import { GroupPrivacy } from './enums/group-privacy.enum';
import { UploadResult } from '../types/upload.types';
import path from 'path';
import fs from 'fs';

@Injectable()
export class GroupsService {
  frontendUrl: 'http://localhost:3000';
  backUrl: 'http://localhost:3002';

  constructor(private prisma: PrismaService,
    @Inject(forwardRef(() => GroupsGateway))
    private readonly GroupsGateway: GroupsGateway,
    /*private readonly uploadService: UploadService */ ) {}

    ///////////////////////////////////////////////////////
    async saveBanner(filename: string): Promise<string> {
      const bannerDir = 'backend/uploads/banners';
      const filePath = path.join(bannerDir, filename);
  
      // Optional: Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error('File not saved');
      }
  
      // You could also update group entity here with banner filename
      // For now, we just return the URL/path
      return `backend/uploads/banners/${filename}`;
    }
    async processBannerUrl(url: string) {
          try {
            // Remove any blob: prefixes or other client-side URLs
            let cleanUrl = url.replace(/^blob:.*?\//, '');
            
            // Handle case when URL is already a full URL (might be external)
            if (cleanUrl.startsWith('http')) {
              // For now, we'll just keep external URLs as is
              // In a real implementation, you might want to download and process these
              console.log('Processing external URL:', cleanUrl);
              return { url: cleanUrl };
            }
            
            // Check if it's already a server URL that we've processed before
            if (cleanUrl.startsWith('/uploads/banners/')) {
              console.log('Already a valid banner URL path:', cleanUrl);
              return { url: cleanUrl };
            }
            // Handle the case where the frontend accidentally sends a localhost:3000 URL
            if (cleanUrl.includes('localhost:3000')) {
            // Extract just the path after localhost:3000
            const parts = cleanUrl.split('localhost:3000');
            if (parts.length > 1) {
              cleanUrl = parts[1];
              console.log('Extracted from frontend URL:', cleanUrl);
            }
          }
            
            // If it's not a recognized path format, log a warning
            console.warn('Unrecognized URL format for banner:', url);
            
            // Return the cleaned URL as a fallback
            return { url: cleanUrl };
          } catch (error) {
            console.error('Process banner URL error:', error);
            throw new BadRequestException('Failed to process banner URL');
          }
        }
        getFullBannerUrl(bannerUrl: string): string {
          if (!bannerUrl) return null;
          
          // Clean the URL of any blob prefixes
          let cleanUrl = bannerUrl.replace(/^blob:.*?\//, '');
          
          // If it's already a full URL, return it
          if (cleanUrl.startsWith('http')) {
            return cleanUrl;
          }
          
          // Ensure the URL starts with a slash for proper joining
          if (!cleanUrl.startsWith('/')) {
            cleanUrl = `/${cleanUrl}`;
          }
          
          // Create a proper absolute URL with the backend URL as base
          const fullUrl = `http://localhost:3002${cleanUrl}`;
          console.log('Transformed banner URL:', fullUrl);
          
          return fullUrl;
        }
    //////////////////////////////////////////////////////
  async user_helper(userId){
    try{
      const response = await fetch(`http://localhost:3001/user/profil/${userId}`,{
          method: "GET"
      })
      return response
    }catch(error){
      console.error(error)
    }
  }
  async uploadBanner(file: Express.Multer.File): Promise<{ url: string }> {
    try {
      const fileName = `banner-${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
      const filePath = path.join(process.cwd(), 'uploads', 'banners', fileName);
      
      // Ensure directory exists
      const dir = path.join(process.cwd(), 'uploads', 'banners');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Save the file
      await fs.promises.writeFile(filePath, file.buffer);
      
      // Return the URL that will be used to access the file
      const url = `/uploads/banners/${fileName}`;
      console.log('Generated banner URL:', url);
      
      return { url };
    } catch (error) {
      console.error('Error uploading banner:', error);
      throw new BadRequestException('Failed to upload banner');
    }
  }

  // async createGroup(createGroupDto: CreateGroupDto, userId: number) {
  //   try {
  //     // Clean the bannerUrl if it exists
  //     if (createGroupDto.bannerUrl) {
  //       // Remove any blob: URLs
  //       createGroupDto.bannerUrl = createGroupDto.bannerUrl.replace(/^blob:.*?\//, '');
        
  //       // Ensure it starts with /uploads/
  //       if (!createGroupDto.bannerUrl.startsWith('/uploads/')) {
  //         createGroupDto.bannerUrl = `/uploads/${createGroupDto.bannerUrl}`;
  //       }
  //     }

  //     const group = await this.prisma.group.create({
  //       data: {
  //         name: createGroupDto.name,
  //         description: createGroupDto.description,
  //         privacy: createGroupDto.privacy || 'PUBLIC',
  //         bannerUrl: createGroupDto.bannerUrl, // This should now be a clean URL path
  //         createdBy: userId,
  //         members: {
  //           create: {
  //             userId: userId,
  //             role: 'ADMIN'
  //           }
  //         }
  //       }
  //     });

  //     console.log('Created group with banner URL:', group.bannerUrl);
  //     return group;
  //   } catch (error) {
  //     console.error('Error in createGroup:', error);
  //     throw error;
  //   }
  // }
  async createGroup(createGroupDto: CreateGroupDto, userId: number) {
    try {
      // Let the uploadService handle banner URL processing
      let bannerUrl = null;
      
      if (createGroupDto.bannerUrl) {
        try {
          // Process the banner URL through the upload service instead of doing it directly here
          const processedBanner = await this.processBannerUrl(createGroupDto.bannerUrl);
          bannerUrl = processedBanner.url;
        } catch (error) {
          console.error('Error processing banner URL:', error);
          // Continue with group creation even if banner processing fails
        }
      }
      
      const group = await this.prisma.group.create({
        data: {
          name: createGroupDto.name,
          description: createGroupDto.description,
          privacy: createGroupDto.privacy || 'PUBLIC',
          bannerUrl: bannerUrl, // Use the properly processed URL from upload service
          createdBy: userId,
          members: {
            create: {
              userId: userId,
              role: 'ADMIN'
            }
          }
        }
      });
  
      console.log('Created group with banner URL:', group.bannerUrl);
      return group;
    } catch (error) {
      console.error('Error in createGroup:', error);
      throw new InternalServerErrorException(`Failed to create group: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.group.findMany({
        where: { status: GroupStatus.ACTIVE },
      });
    } catch (error) {
      console.error('Error finding groups:', error);
      throw new InternalServerErrorException('Failed to retrieve groups');
    }
  }

  // group.service.ts
  async findGroupById(id: number) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        bannerUrl: true,
        status: true,
        privacy: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        members: true
      }
    });
  
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
  
    return group;
  }

  async findOne(id: number) {
    try {
      const group = await this.prisma.group.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          privacy: true,
          createdAt: true,
          bannerUrl: true,  // Make sure this is included
          // memberCount: true,
          createdBy: true,
        },
      });

      if (!group) {
        throw new NotFoundException(`Group with ID ${id} not found`);
      }

      console.log('Group found with banner:', group.bannerUrl);
      return group;
    } catch (error) {
      console.error('Error in findOne:', error);
      throw error;
    }
  }

  async findMany(name: string) {
    try {
      const group = await this.prisma.group.findMany({
        where: { name }, // Now name is unique
      });
  
      if (!group) {
        throw new NotFoundException(`Group with name "${name}" not found`);
      }
  
      return group;
    } catch (error) {
      console.error('Error finding group:', error);
      throw new InternalServerErrorException('Failed to retrieve group');
    }
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    try {
      const group = await this.prisma.group.update({
        where: { id },
        data: {
          name: updateGroupDto.name,
          description: updateGroupDto.description,
          bannerUrl: updateGroupDto.bannerUrl,
          status: GroupStatus.ACTIVE
        },
      });
      return group;
    } catch (error) {
      console.error('Error updating group:', error);
      throw new InternalServerErrorException('Failed to update group');
    }
  }

  async archiveGroup(id: number) {
    try {
      const group = await this.prisma.group.findUnique({
        where: { id },
      });
  
      if (!group) {
        throw new NotFoundException(`Group with ID ${id} not found`);
      }
  
      return await this.prisma.group.update({
        where: { id },
        data: {
          status: GroupStatus.ARCHIVED,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error archiving group:', error);
      throw new InternalServerErrorException('Failed to archive group');
    }
  }

  async activeGroup(id: number) {
    try {
      const group = await this.prisma.group.findUnique({
        where: { id },
      });
  
      if (!group) {
        throw new NotFoundException(`Group with ID ${id} not found`);
      }
  
      return await this.prisma.group.update({
        where: { id },
        data: {
          status: GroupStatus.ACTIVE,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error archiving group:', error);
      throw new InternalServerErrorException('Failed to archive group');
    }
  }

  /*



    Always check the users creds, infos, existence in user service
    Fetch, axios using HTTP methods



  */

  async addMember(groupId: number, addMemberDto: AddMemberDto) {
    try {
      // Check if user exists
      const response =  await this.user_helper(addMemberDto)
      const data = await response.json()

      if (data.statusCode === 404) {
        throw new NotFoundException(`User with ID ${addMemberDto.userId} not found`);
      }
      // const user = await this.prisma.user.findUnique({
      //   where: { id: addMemberDto.userId },
      // });


      // Check if membership already exists
      const existingMember = await this.prisma.member.findFirst({
        where: {
          userId: addMemberDto.userId,
          groupId: groupId,
        },
      });

      if (existingMember) {
        throw new ConflictException('User is already a member of this group');
      }

      return await this.prisma.member.create({
        data: {
          userId: addMemberDto.userId,
          groupId: groupId,
          role: "MEMBER"
        },
        include: {
          group: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      console.error('Error adding member:', error);
      throw new InternalServerErrorException('Failed to add member to group');
    }
  }

  async updateMember(id: number, updateMemberDto: updateMemberDto) {
    try {
      console.log('Updating member:', {groupId: id, ...updateMemberDto});
      
      // Validate that the group exists
      const group = await this.prisma.group.findUnique({
        where: { id }
      });
      
      if (!group) {
        throw new NotFoundException(`Group with ID ${id} not found`);
      }
      
      // Validate that the member exists
      const existingMember = await this.prisma.member.findUnique({
        where: {
          userId_groupId: {
            userId: updateMemberDto.userId,
            groupId: id
          }
        }
      });
      
      if (!existingMember) {
        throw new NotFoundException(
          `Member with userId ${updateMemberDto.userId} not found in group ${id}`
        );
      }
      
      // Update the member with the new role
      const updatedMember = await this.prisma.member.update({
        where: {
          userId_groupId: {
            userId: updateMemberDto.userId,
            groupId: id
          }
        },
        data: {
          role: updateMemberDto.role
        },
        include: {
          group: true
        }
      });
      
      console.log('Updated member:', updatedMember);
      return updatedMember;
    } catch (error) {
      console.error('Error updating member:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error updating member: ${error.message}`);
    }
  }

  async removeMember(groupId: number, userId: number) {
    try {
      const member = await this.prisma.member.findFirst({
        where: {
          userId: userId,
          groupId: groupId,
        },
      });

      if (!member) {
        throw new NotFoundException('Member not found in this group');
      }

      return await this.prisma.member.delete({
        where: { id: member.id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error removing member:', error);
      throw new InternalServerErrorException('Failed to remove member from group');
    }
  }
  async createMembershipRequest(userId: number, groupId: number) {
    try {
      // Check if user already has a pending request
      const existingRequest = await this.prisma.membershipRequest.findUnique({
        where: {
          userId_groupId: {
            userId,
            groupId
          }
        }
      });
  
      if (existingRequest) {
        throw new ConflictException('Request already exists');
      }
  
      const request = await this.prisma.membershipRequest.create({
        data: {
          userId,
          groupId,
          status: 'PENDING'
        },
        include: {
          group: true
        }
      });
  
      // Notify about new join request using the GroupsGateway
      // Methode Dyal Notif ms 
      await this.GroupsGateway.notifyNewJoinRequest(
        groupId,
        userId,
        request.group.name
      );
  
      return request;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      console.error('Error creating membership request:', error);
      throw new BadRequestException('Failed to create membership request');
    }
  }

  // create post group
  async createGroupPost(groupId: number, authorId: number, content: string, attachments?: string[]) {
    try {
      // Verify user is member of group
      const membership = await this.prisma.member.findFirst({
        where: { groupId, userId: authorId },
      });

      if (!membership) {
        throw new ForbiddenException('You must be a member to post in this group');
      }

      // Create post in publication service
      const publicationPost = await this.GroupsGateway.createGroupPost({
        groupId,
        authorId,
        content,
        attachments
      });
      // Store reference in local database
      return this.prisma.post.create({
        data: {
          publicationId: publicationPost.id,
          groupId,
          authorId,
        },
      });
    } catch (error) {
      console.error('Error creating group post:', error);
      throw new InternalServerErrorException('Failed to create group post');
    }
  }

  async getGroupPosts(groupId: number) {
    try {
      // Get posts from publication service
      const posts = await this.GroupsGateway.getGroupPosts(groupId);
      
      // Map with local post references
      const localPosts = await this.prisma.post.findMany({
        where: { groupId }
      });
      // Combine data from both sources
      return posts.map(post => ({
        ...post,
        localReference: localPosts.find(lp => lp.publicationId === post.id)
      }));
    } catch (error) {
      console.error('Error fetching group posts:', error);
      throw new InternalServerErrorException('Failed to fetch group posts');
    }
  }

  async handleMembershipRequest(
    requestId: number, 
    status: RequestStatus,
    adminId: number
  ): Promise<any> {
    const request = await this.prisma.membershipRequest.findUnique({
      where: { id: requestId },
      include: { group: true },
    });
  
    if (!request) {
      throw new NotFoundException('Request not found');
    }
  
    // Verify admin has permission for this group
    const adminMember = await this.prisma.member.findFirst({
      where: {
        groupId: request.groupId,
        userId: adminId,
        role: { in: ['ADMIN', 'MODERATOR'] },
      },
    });
  
    if (!adminMember) {
      throw new ForbiddenException('Not authorized to handle requests');
    }
  
    // Update request status
    const updatedRequest = await this.prisma.membershipRequest.update({
      where: { id: requestId },
      data: { status },
    });
  
    // If accepted, add member to group
    if (status === RequestStatus.ACCEPTED) {
      await this.addMember(request.groupId, {
        userId: request.userId,
        role: 'MEMBER',
      });
    }
  
    return updatedRequest;
  }

  async getPendingRequests(groupId: number) {
    return await this.prisma.membershipRequest.findMany({
      where: {
        groupId,
        status: 'PENDING'
      }
    });
  }

  async getUserRequests(userId: number) {
    return await this.prisma.membershipRequest.findMany({
      where: {
        userId
      },
      include: {
        group: true
      }
    });
  }
  async blockUser(groupId: number, blockUserDto: BlockUserDto, adminId: number) {
    try {
      // Check if the group exists
      const group = await this.prisma.group.findUnique({
        where: { id: groupId },
      });

      if (!group) {
        throw new NotFoundException(`Group with ID ${groupId} not found`);
      }

      // Check if the user making the request is the admin of the group
      if (group.createdBy !== adminId) {
        throw new ForbiddenException('Only the group admin can block users');
      }

      // Check if the user to be blocked is already blocked
      const existingBlock = await this.prisma.blockedUser.findFirst({
        where: {
          groupId: groupId,
          userId: blockUserDto.userId,
        },
      });

      if (existingBlock) {
        throw new ConflictException('User is already blocked in this group');
      }

      // Block the user
      const blockedUser = await this.prisma.blockedUser.create({
        data: {
          groupId: groupId,
          userId: blockUserDto.userId,
          reason: blockUserDto.reason,
        },
        include: {
          group: true, // Include group details in the response
        },
      });

      return blockedUser;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      console.error('Error blocking user:', error);
      throw new InternalServerErrorException('Failed to block user');
    }
  }

// /////////////////////////////

// // Additional methods for groups.service.ts

async unblockUser(groupId: number, userId: number, adminId: number) {
  try {
    // Verify group exists
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    // Check if the user making the request is an admin of the group
    if (group.createdBy !== adminId) {
      throw new ForbiddenException('Only the group admin can unblock users');
    }

    // Find the blocked user record
    const blockedUser = await this.prisma.blockedUser.findFirst({
      where: {
        groupId,
        userId,
      },
    });

    if (!blockedUser) {
      throw new NotFoundException(`User with ID ${userId} is not blocked in this group`);
    }

    // Unblock the user
    return await this.prisma.blockedUser.delete({
      where: { id: blockedUser.id },
    });
  } catch (error) {
    if (
      error instanceof NotFoundException ||
      error instanceof ForbiddenException
    ) {
      throw error;
    }
    console.error('Error unblocking user:', error);
    throw new InternalServerErrorException('Failed to unblock user');
  }
}

async getBlockedUsers(groupId: number) {
  try {
    return await this.prisma.blockedUser.findMany({
      where: { groupId },
    });
  } catch (error) {
    console.error('Error fetching blocked users:', error);
    throw new InternalServerErrorException('Failed to fetch blocked users');
  }
}

async inviteUser(groupId: number, inviteUserDto: InviteUserDto, inviterId: number) {
  try {
    // Check if the inviter is a member of the group
    const inviterMembership = await this.prisma.member.findFirst({
      where: {
        groupId,
        userId: inviterId,
      },
    });

    if (!inviterMembership) {
      throw new ForbiddenException('Only group members can send invitations');
    }

    // Check if the user to be invited exists
    const response =  await this.user_helper(inviteUserDto)
    const data = await response.json()
    
    if (data.statusCode === 404) {
      throw new NotFoundException(`User with ID ${inviteUserDto.userId} not found`);
    }
    // const userToInvite = await this.prisma.user.findUnique({
    //   where: { id: inviteUserDto.userId },
    // });

    // if (!userToInvite) {
    //   throw new NotFoundException(`User with ID ${inviteUserDto.userId} not found`);
    // }

    // Check if the user is already a member
    const existingMember = await this.prisma.member.findFirst({
      where: {
        groupId,
        userId: inviteUserDto.userId,
      },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this group');
    }

    // Check if the user is already invited
    const existingInvitation = await this.prisma.invitation.findUnique({
      where: {
        userId_groupId: {
          userId: inviteUserDto.userId,
          groupId,
        },
      },
    });

    if (existingInvitation) {
      throw new ConflictException('User is already invited to this group');
    }

    // Create the invitation
    return await this.prisma.invitation.create({
      data: {
        userId: inviteUserDto.userId,
        groupId,
        status: 'PENDING',
      },
      include: {
        group: true,
      },
    });
  } catch (error) {
    if (
      error instanceof NotFoundException ||
      error instanceof ForbiddenException ||
      error instanceof ConflictException
    ) {
      throw error;
    }
    console.error('Error inviting user:', error);
    throw new InternalServerErrorException('Failed to invite user');
  }
}

async getGroupInvitations(groupId: number) {
  try {
    return await this.prisma.invitation.findMany({
      where: { groupId },
    });
  } catch (error) {
    console.error('Error fetching group invitations:', error);
    throw new InternalServerErrorException('Failed to fetch group invitations');
  }
}

async getUserInvitations(userId: number) {
  try {
    return await this.prisma.invitation.findMany({
      where: { userId },
      include: { group: true },
    });
  } catch (error) {
    console.error('Error fetching user invitations:', error);
    throw new InternalServerErrorException('Failed to fetch user invitations');
  }
}

async handleInvitation(invitationId: number, status: 'ACCEPTED' | 'REJECTED', userId: number) {
  try {
    // Start a transaction
    return await this.prisma.$transaction(async (prisma) => {
      const invitation = await prisma.invitation.findUnique({
        where: { id: invitationId },
      });

      if (!invitation) {
        throw new NotFoundException('Invitation not found');
      }

      if (invitation.userId !== userId) {
        throw new ForbiddenException('You can only respond to your own invitations');
      }

      if (invitation.status !== 'PENDING') {
        throw new BadRequestException('Invitation has already been handled');
      }

      // Update the invitation status
      const updatedInvitation = await prisma.invitation.update({
        where: { id: invitationId },
        data: { status },
      });

      // If accepted, create a new member
      if (status === 'ACCEPTED') {
        await prisma.member.create({
          data: {
            userId: invitation.userId,
            groupId: invitation.groupId,
            role: 'MEMBER',
          },
        });
      }

      return updatedInvitation;
    });
  } catch (error) {
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException ||
      error instanceof ForbiddenException
    ) {
      throw error;
    }
    console.error('Error handling invitation:', error);
    throw new InternalServerErrorException('Failed to handle invitation');
  }
}

async findUserMemberships(userId: number) {
  try {
    return await this.prisma.member.findMany({
      where: { userId },
      include: { 
        group: true 
      },
    });
  } catch (error) {
    console.error('Error finding user memberships:', error);
    throw new InternalServerErrorException('Failed to retrieve user memberships');
  }
}

async checkUserInGroup(userId: number, groupId: number) {
  try {
    const membership = await this.prisma.member.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });
    return !!membership;
  } catch (error) {
    console.error('Error checking user in group:', error);
    throw new InternalServerErrorException('Failed to check user membership');
  }
}

async checkMembership(groupId: number, userId: number): Promise<boolean> {
  const member = await this.prisma.member.findUnique({
    where: {
      userId_groupId: {
        userId: userId,
        groupId: groupId,
      },
    },
  });
  return !!member;
}

async findGroupWithMembers(groupId: number) {
  try {
    return await this.prisma.group.findUnique({
      where: { id: groupId },

    });
  } catch (error) {
    console.error('Error finding group with members:', error);
    throw new InternalServerErrorException('Failed to retrieve group with members');
  }
}

async getGroupMembers(groupId: number) {
  // First verify group exists
  const group = await this.prisma.group.findUnique({
    where: { id: groupId }
  });

  if (!group) {
    throw new NotFoundException(`Group with ID ${groupId} not found`);
  }

  // Get all members with their roles
  const members = await this.prisma.member.findMany({
    where: {
      groupId: groupId
    },
    select: {
      userId: true,
      role: true,
      joinedAt: true
    }
  });

  // Fetch user details from user service for each member
  const membersWithDetails = await Promise.all(
    members.map(async (member) => {
      try {
        const response = await fetch(`http://localhost:3001/user/profil/${member.userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user ${member.userId}`);
        }

        const userData = await response.json();
        
        return {
          ...userData,
          role: member.role,
          joinedAt: member.joinedAt
        };
      } catch (error) {
        console.error(`Error fetching user ${member.userId}:`, error);
        return {
          userId: member.userId,
          role: member.role,
          joinedAt: member.joinedAt,
          error: 'Failed to fetch user details'
        };
      }
    })
  );

  return membersWithDetails;
}
async getGroupMember(groupId: number, userId: number) {
  // First check if member exists in group
  const member = await this.prisma.member.findUnique({
    where: {
      userId_groupId: {
        userId: userId,
        groupId: groupId
      }
    }
  });

  if (!member) {
    throw new NotFoundException(`Member ${userId} not found in group ${groupId}`);
  }

  try {
    // Fetch user details from user service
    const response = await fetch(`http://localhost:3001/user/profil/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user ${userId}`);
    }

    const userData = await response.json();

    // Return combined member and user data
    return {
      ...userData,
      role: member.role,
      joinedAt: member.joinedAt,
      groupId: member.groupId
    };

  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw new InternalServerErrorException(`Failed to fetch member details: ${error.message}`);
  }
}

///////////////////////////////////////////


}

export default GroupsService;


