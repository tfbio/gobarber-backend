export default interface IMailingProvider {
  sendEmail(to: string, content: string): Promise<void>;
}
