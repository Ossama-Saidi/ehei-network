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
        <p>Bonjour,</p>
        <p>Votre compte a été validé. Cliquez sur le lien ci-dessous pour vous connecter :</p>
        <a href="${url}">${url}</a>
        <p>Merci de votre confiance.</p>
      `,
    });
  }
}
