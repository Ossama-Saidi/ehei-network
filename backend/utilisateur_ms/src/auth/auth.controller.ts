import { Controller, Post, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials.email, credentials.password);
  }
  @MessagePattern({ cmd: 'verify_jwt' })
  async verifyToken(token: string ) {
    console.log('[USER_SERVICE] 🔐 Received verify_jwt request');
    const start = Date.now();
    const response = await this.authService.verifyToken(token);
    console.log('[USER_SERVICE] ✅ Token verified in', Date.now() - start, 'ms');
    return response;
  }
}
