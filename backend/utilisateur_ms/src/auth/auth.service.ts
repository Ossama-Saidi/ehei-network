import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/auth.dto';
import { ClientProxy } from '@nestjs/microservices';
// import * as jwt from 'jsonwebtoken';
import { Inject } from '@nestjs/common';

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject('PUBLICATION_EVENTS_SERVICE') 
    private readonly userEventsClient: ClientProxy
  ) {}

  async verifyToken(token: string) {
    console.log('[USER_SERVICE] ➡️ Inside verifyToken method');
    try{
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Utiliser le jwtService au lieu de jwt.verify directement
    const decoded = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET
    });
    console.log('[USER_SERVICE] ✅ Token verified', decoded);
    return { isValid: true, user: decoded };
    } catch(error) {
      console.log('[USER_SERVICE] ❌ Token verification failed:', error.message);
      return { isValid: false, error: error.message };
    }
  }

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
    // Generate the token as you were doing before
    const token = this.generateToken(user);
        
    // Emit an event that a user was created
    this.userEventsClient.emit('user_created', {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      // Include any other user fields needed by the publication service
    });    
    return { user, token };
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
//--------------------------------------------
//---------- LOOK HERE IMPORTANTE-------------
//--------------------------------------------
  // async update(id: string, updateUserDto) {
  //   // Update in database
  //   const user = await this.usersRepository.update(id, updateUserDto);
    
  //   // Emit event
  //   this.eventEmitter.emit('user.updated', user);
    
  //   return user;
  // }

  // async remove(id: string) {
  //   await this.usersRepository.delete(id);
    
  //   // Emit event
  //   this.eventEmitter.emit('user.deleted', { id });
  // }
  /**
   * Generate JWT token
   * @param user - User object
   */
  private generateToken(user: any): string {
    return this.jwtService.sign({ 
      sub: user.id, 
      email: user.email, 
      role: user.role, 
      nomComplet: `${user.nom} ${user.prenom}`,
      nom: user.nom,
      prenom: user.prenom
    });
  }
}