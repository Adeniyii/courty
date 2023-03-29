/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Space cowboy!';
  }

  async sendEmail(to: string, subject: string, html: string) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // const testAccount = await nodemailer.createTestAccount();
    // console.log('testAccount', testAccount);

    const transporter = nodemailer.createTransport({
      // @ts-ignore
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Courty 👻" <foo@example.com>', // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);

    // Preview only available when sending through an Ethereal account
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
}
