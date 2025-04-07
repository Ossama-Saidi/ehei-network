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
  async verifyJwt(data: { token: string }) {
    return this.authService.decodeToken(data.token);
  }
}
