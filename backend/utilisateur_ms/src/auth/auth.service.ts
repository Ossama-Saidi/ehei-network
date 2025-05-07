import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/auth.dto';
import { ClientProxy } from '@nestjs/microservices';
// import * as jwt from 'jsonwebtoken';
import { Inject } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject('PUBLICATION_EVENTS_SERVICE') 
    private readonly userEventsClient: ClientProxy,
    private readonly mailService: MailService,

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
      data: {
        ...data,
        password: hashedPassword,
        is_approved: false // 🔒 par défaut non approuvé
      },
    });
    // Generate the token as you were doing before
    // const token = this.generateToken(user);
        
    // // Émettre un événement pour notifier l'admin
    // this.userEventsClient.emit('user.pending_approval', {
    //   id: user.id,
    //   email: user.email,
    //   nom: user.nom,
    //   prenom: user.prenom,
    //   role: user.role,
    // });

    // Emit an event that a user was created
    // this.userEventsClient.emit('user_created', {
    //   id: user.id,
    //   email: user.email,
    //   nom: user.nom,
    //   prenom: user.prenom,
    //   role: user.role,
    //   // Include any other user fields needed by the publication service
    // });    
    // return { user, token };
    // ⚠️ Pas de token retourné ici !
    return {
      message: "Votre compte a été créé et est en attente de validation par l'administrateur."
    };
  }
/**
   * Appelé par l'admin pour approuver un utilisateur
   * et lui envoyer son token
   */
async approveUser(id: string) {
  const user = await this.prisma.utilisateur.update({
    where: { id: parseInt(id) }, // 🛠 conversion ici
    data: { is_approved: true },
  });

  const token = this.generateToken(user);

  // Événement vers les autres microservices (par ex: publication)
  this.userEventsClient.emit('user_created', {
    id: user.id,
    email: user.email,
    nom: user.nom,
    prenom: user.prenom,
    role: user.role,
  });

  // ✉️ Envoi de l'e-mail de validation
  await this.mailService.sendValidationEmail(user.email);

  return {
    message: 'Utilisateur approuvé, email de connexion envoyé.',
    token, // pour debug ou logs
  };
}

  /**
   * Login user
   * @param email - User email
   * @param password - User password
   */
  async login(email: string, password: string) {
    const user = await this.prisma.utilisateur.findUnique({ where: { email } });
  
    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
  
    // 🔒 Vérifier si le compte est approuvé
    if (!user.is_approved) {
      throw new UnauthorizedException("Votre compte est en attente d'approbation par l'administrateur.");
    }
  
    // ✅ Génération du token uniquement si approuvé
    return {
      user,
      token: this.generateToken(user),
    };
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
      prenom: user.prenom,
      bio: user.bio,
      badge: user.badge,
      telephone: user.telephone,
    });
  }
}