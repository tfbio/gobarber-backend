import IMailingProvider from '../models/IMailingProvider';
import ISendMailDTO from '../DTOs/ISendMailDTO';

class FakeIMailingProvider implements IMailingProvider {
  private emailSent: ISendMailDTO[] = [];

  public async sendEmail(message: ISendMailDTO): Promise<void> {
    this.emailSent.push(message);
  }
}

export default FakeIMailingProvider;
