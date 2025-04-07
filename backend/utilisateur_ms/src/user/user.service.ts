import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModifyUserDto } from 'src/auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { FileUploadService } from '../file-upload/FileUploadService';


@Injectable()
export class UserService {
  fileUploadService: any;
  constructor(private readonly prisma: PrismaService,
  //private readonly fileUploadService: FileUploadService
  ) {}
  
  /**
   * Get user by email
   * @param email - User email
   */
  async getUserByEmail(email: string) {
    return this.prisma.utilisateur.findUnique({ where: { email } });
  }

  /**
   * Get all users
   */
  async getAllUsers() {
    return this.prisma.utilisateur.findMany();
  }

  /**
   * Update user by ID
   * @param userId - User ID
   */
  async updateUser(userId: number, updateUserDto: ModifyUserDto) {
    return this.prisma.utilisateur.update({
      where: { id: userId },
      data: updateUserDto,
    });
  }

  /**
   * Get user by ID
   * @param userId - User ID
   */
  async getUserById(userId: number) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
      select: {
        id: true,
        prenom: true,
        nom: true,
        email: true,
        telephone: true,
        bio: true,
        profilePhoto: true,
        bannerPhoto: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
    /**
     * Modify user profile
     * @param userId - User ID
     * @param updateData - Data to update user profile
     */
    async modify(userId: number, updateData: ModifyUserDto) {
      return this.prisma.utilisateur.update({ where: { id: userId }, data: updateData });
    }
  
    /**
     * Change user password
     * @param userId - User ID
     * @param oldPassword - Old password
     * @param newPassword - New password
     */
    async changePassword(userId: number, oldPassword: string, newPassword: string) {
      const user = await this.prisma.utilisateur.findUnique({ where: { id: userId } });
  
      if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
        throw new UnauthorizedException('Invalid old password');
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.utilisateur.update({ where: { id: userId }, data: { password: hashedPassword } });
  
      return { message: 'Password changed successfully' };
    }

    /**
   * Send a friendship invitation
   * @param senderId - User ID sending the invitation
   * @param receiverId - User ID receiving the invitation
   */
  async sendFriendshipInvitation(senderId: number, receiverId: number) {
    const existingInvitation = await this.prisma.Friendship.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existingInvitation) throw new UnauthorizedException('Invitation already sent or already friends');

    return this.prisma.Friendship.create({
      data: {
        senderId,
        receiverId,
        status: 'pending',
      },
    });
  }

  /**
   * Accept a friendship invitation
   * @param userId - User ID accepting the invitation
   * @param senderId - Sender of the invitation
   */
  async acceptFriendship(userId: number, senderId: number) {
    const invitation = await this.prisma.Friendship.findFirst({
      where: {
        senderId,
        receiverId: userId,
        status: 'pending',
      },
    });

    if (!invitation) throw new UnauthorizedException('No pending invitation found');

    return this.prisma.Friendship.update({
      where: { id: invitation.id },
      data: { status: 'accepted' },
    });
  }

  /**
   * Reject a friendship invitation
   * @param userId - User ID rejecting the invitation
   * @param senderId - Sender of the invitation
   */
  async rejectFriendship(userId: number, senderId: number) {
    const invitation = await this.prisma.Friendship.findFirst({
      where: {
        senderId,
        receiverId: userId,
        status: 'pending',
      },
    });

    if (!invitation) throw new UnauthorizedException('No pending invitation found');

    return this.prisma.Friendship.update({
      where: { id: invitation.id },
      data: { status: 'rejected' },
    });
  }

  /**
   * Delete a friend
   * @param userId - User ID requesting to delete a friend
   * @param friendId - Friend's ID to be deleted
   */
  async deleteFriend(userId: number, friendId: number) {
    const friendship = await this.prisma.Friendship.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
        status: 'accepted',
      },
    });

    if (!friendship) throw new UnauthorizedException('No friend found to delete');

    return this.prisma.Friendship.delete({ where: { id: friendship.id } });
  }

  /**
   * Block a friend
   * @param userId - User ID requesting to block a friend
   * @param friendId - Friend's ID to be blocked
   */
  async blockFriend(userId: number, friendId: number) {
    const friendship = await this.prisma.Friendship.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
        status: 'accepted',
      },
    });

    if (!friendship) throw new UnauthorizedException('No friend found to block');

    return this.prisma.Friendship.update({
      where: { id: friendship.id },
      data: { status: 'blocked' },
    });
  }

  /**
   * Enable or disable a user account
   * @param userId - User ID whose account status needs to be changed
   * @param status - 'enabled' or 'disabled'
   */
  // Enable user account
  async enableAccount(userId: number) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.utilisateur.update({
      where: { id: userId },
      data: { status: 'enabled' },
    });
  }

  // Disable user account
  async disableAccount(userId: number) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.utilisateur.update({
      where: { id: userId },
      data: { status: 'disabled' },
    });
  }

  async uploadBanner(userId: number, file: Express.Multer.File): Promise<{ url: string }> {
    try {
      // Upload the file
      const bannerUrl = await this.fileUploadService.uploadFile(file, 'banners');
      
      // Update user with new banner URL
      await this.prisma.utilisateur.update({
        where: { id: userId },
        data: { bannerPhoto: bannerUrl }
      });
      
      return { url: bannerUrl };
    } catch (error) {
      throw new BadRequestException(`Failed to upload banner: ${error.message}`);
    }
  }
  
  /**
   * Upload profile image for user
   * @param userId - User ID
   * @param file - Uploaded file
   */
  async uploadProfile(userId: number, file: Express.Multer.File): Promise<{ url: string }> {
    try {
      // Upload the file
      const profileUrl = await this.fileUploadService.uploadFile(file, 'profiles');
      
      // Update user with new profile URL
      await this.prisma.utilisateur.update({
        where: { id: userId },
        data: { profilePhoto: profileUrl }
      });
      
      return { url: profileUrl };
    } catch (error) {
      throw new BadRequestException(`Failed to upload profile photo: ${error.message}`);
    }
  }
  
  /**
   * Get temporary URL for direct upload
   * @param fileType - MIME type of the file
   * @param uploadType - Type of upload (banner or profile)
   */
  async getTemporaryUploadUrl(fileType: string, uploadType: 'banner' | 'profile'): Promise<{ url: string, fields: any }> {
    try {
      const subfolder = uploadType === 'banner' ? 'banners' : 'profiles';
      return await this.fileUploadService.getTemporaryUploadUrl(fileType, subfolder);
    } catch (error) {
      throw new BadRequestException(`Failed to generate temporary upload URL: ${error.message}`);
    }
  }

}
 /* private readonly uploadDir = path.join(__dirname, '..', 'uploads'); // Use path.join

  async uploadBanner(file: Express.Multer.File, updateData: ModifyUserDto): Promise<string> {
    return this.uploadFile(file, 'banners');
  }

  async uploadProfile(file: Express.Multer.File, updateData: ModifyUserDto): Promise<string> {
    return this.uploadFile(file, 'profiles');
  }

  private async uploadFile(file: Express.Multer.File, subfolder: string): Promise<string> {
    try {
      // Validate the file
      this.validateFile(file);

      // Ensure the upload directory exists
      const uploadDir = this.getUploadDirectory(subfolder);

      // Generate a unique filename
      const uniqueFileName = this.generateUniqueFileName(file, subfolder);

      // Save the file to the upload directory
      const filePath = path.join(uploadDir, uniqueFileName);
      this.saveFile(file.buffer, filePath);

      // Return the file URL
      return this.getFileUrl(subfolder, uniqueFileName);
    } catch (error) {
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Check file type (e.g., allow only images)
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
    }
  }

  private getUploadDirectory(subfolder: string): string {
    const uploadDir = path.join(this.uploadDir, subfolder);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    return uploadDir;
  }

  private generateUniqueFileName(file: Express.Multer.File, subfolder: string): string {
    const fileExtension = path.extname(file.originalname); // Get the file extension
    return `${subfolder}_${Date.now()}${fileExtension}`; // Generate a unique filename
  }

  private saveFile(buffer: Buffer, filePath: string): void {
    fs.writeFileSync(filePath, buffer); // Save the file to the specified path
  }

  private getFileUrl(subfolder: string, fileName: string): string {
    return `/uploads/${subfolder}/${fileName}`; // Generate the file URL
  }
*/
  
