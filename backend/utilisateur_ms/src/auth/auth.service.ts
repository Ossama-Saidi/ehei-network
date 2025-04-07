import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/auth.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  decodeToken(token: string) {
    try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.sub;
  }catch(error){
    throw new Error('Method not implemented.');
  }
  }
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   * @param data - User registration data
   */
  async register(data: RegisterDto) {
    const existingUser = await this.prisma.utilisateur.findUnique({ where: { email: data.email } });

    if (existingUser) throw new UnauthorizedException('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.utilisateur.create({
      data: { ...data, password: hashedPassword },
    });

    return { user, token: this.generateToken(user) };
  }

  /**
   * Login user
   * @param email - User email
   * @param password - User password
   */
  async login(email: string, password: string) {
    const user = await this.prisma.utilisateur.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { user, token: this.generateToken(user) };
  }

  /**
   * Generate JWT token
   * @param user - User object
   */
  private generateToken(user: any): string {
    return this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
  }
  
}