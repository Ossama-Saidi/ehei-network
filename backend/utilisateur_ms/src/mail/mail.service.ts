import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // SSL sur port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

  async sendValidationEmail(email: string): Promise<void> {
    const url = `http://localhost:3000/login`;

    await this.transporter.sendMail({
      from: '"EHEI Connect" <no-reply@ehei.com>',
      to: email,
      subject: 'Votre compte a été approuvé ✔',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #007BFF; padding: 20px; text-align: center;">
        </div>
        <div style="padding: 30px; color: #333;">
          <h2 style="color: #007BFF;">Bienvenue sur EHEI Connect !</h2>
          <p>Bonjour,</p>
          <p>Votre compte a été validé avec succès. Cliquez sur le bouton ci-dessous pour vous connecter :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="background-color: #007BFF; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Se connecter
            </a>
          </div>
          <p>Merci de faire confiance à EHEI Connect.</p>
        </div>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888;">
          © 2025 EHEI Connect. Tous droits réservés.
        </div>
      </div>
    </div>
      `,
    });
  }
}
