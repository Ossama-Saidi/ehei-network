// publication-service/src/users/users.controller.ts
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UserCacheService } from './user-cache.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userCacheService: UserCacheService) {}

  // Get user by ID
  @Get(':id')
  getUserById(@Param('id') id: number) {
    const user = this.userCacheService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  // Get all users
  @Get()
  getAllUsers() {
    const users = this.userCacheService.getAllUsers();
    return users;
  }
}