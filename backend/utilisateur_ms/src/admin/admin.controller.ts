import { Controller, Get, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('pending-users')
  getPendingUsers() {
    return this.adminService.getPendingUsers();
  }

  @Post('approve-user/:id')
  approveUser(@Param('id') id: string) {
    return this.adminService.approveUser(id);
  }

  @Get('stats/roles')
async getUserCountsByRole() {
  return this.adminService.getUserCountsByRole();
}

@Get('stats/users-by-role')
async getMonthlyUserCountsByRole() {
  return this.adminService.getMonthlyUserCountsByRole();
}

}
