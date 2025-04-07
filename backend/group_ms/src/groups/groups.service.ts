import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, BadRequestException, ForbiddenException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestStatus } from './enums/request-status.enum';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { updateMemberDto } from './dto/update-member.dto';
import { GroupStatus } from './enums/group-status.enum';
import { BlockUserDto } from './dto/block-user.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { UploadService } from 'src/modules/uploads/upload.service';

@Injectable()
export class GroupsService {
  uploadService: any;
  groupRepository: any;
  constructor(private prisma: PrismaService) {}

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
  async create(createGroupDto: CreateGroupDto, bannerFile?: Express.Multer.File) {
    let bannerPath = null;
    
    if (bannerFile) {
      const uploadResult = await this.uploadService.uploadBanner(bannerFile);
      bannerPath = uploadResult.path;
    }
    // Proceed with group creation
    const group = await this.prisma.group.create({
      data: {
        name: createGroupDto.name,
        description: createGroupDto.description,
        createdBy: createGroupDto.createdBy,
        bannerUrl: bannerPath,
        members: {
          create: {
            userId: createGroupDto.createdBy,
            role: 'ADMIN'
          }
        }
      }
    });
  
    return group;
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
  return this.prisma.group.findUnique({
    where: { id },
  });
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
          photoUrl: updateGroupDto.photoUrl,
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
      const group = await this.prisma.member.update({
        where: { id },
        data: updateMemberDto
      });
      return group;
    } catch (error) {
      console.error('Error updating group:', error);
      throw new InternalServerErrorException('Failed to update group');
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

      // Check if user is already a member
      const existingMember = await this.prisma.member.findUnique({
        where: {
          userId_groupId: {
            userId,
            groupId
          }
        }
      });

      if (existingMember) {
        throw new ConflictException('User is already a member of this group');
      }

      return await this.prisma.membershipRequest.create({
        data: {
          userId,
          groupId,
          status: 'PENDING'
        },
        include: {
          group: true
        }
      });
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new BadRequestException('Failed to create membership request');
    }
  }

  async handleMembershipRequest(requestId: number, status: RequestStatus) {
    const request = await this.prisma.membershipRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) {
      throw new NotFoundException('Membership request not found');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request has already been handled');
    }

    if (status === 'ACCEPTED') {
      // Create member record
      await this.prisma.member.create({
        data: {
          userId: request.userId,
          groupId: request.groupId,
          role: 'MEMBER'
        }
      });
    }

    // Update request status
    return await this.prisma.membershipRequest.update({
      where: { id: requestId },
      data: { status },
      include: {
        group: true
      }
    });
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

/////////////////////////////

// Additional methods for groups.service.ts

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
}
