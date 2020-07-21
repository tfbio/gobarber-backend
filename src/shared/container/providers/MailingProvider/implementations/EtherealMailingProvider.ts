import nodemailer, { Transporter } from 'nodemailer';
import IMailingProvider from '../models/IMailingProvider';

class EtherealIMailingProvider implements IMailingProvider {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async sendEmail(to: string, content: string): Promise<void> {
    const message = await this.client.sendMail({
      from: 'GoBarber Team <team@gobarber.com>',
      to,
      subject: 'Password recovery',
      text: content,
    });

    console.log(`Message sent: ${message.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`);
  }
}

export default EtherealIMailingProvider;
