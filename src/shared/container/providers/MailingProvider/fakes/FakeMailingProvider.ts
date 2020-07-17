import IMailingProvider from '../models/IMailingProvider';

interface IEmailFormat {
  to: string;
  content: string;
}

class FakeIMailingProvider implements IMailingProvider {
  private emailSent: IEmailFormat[] = [];

  public async sendEmail(to: string, content: string): Promise<void> {
    this.emailSent.push({
      to,
      content,
    });
  }
}

export default FakeIMailingProvider;
