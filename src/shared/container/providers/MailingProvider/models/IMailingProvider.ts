import ISendMailDTO from '../DTOs/ISendMailDTO';

export default interface IMailingProvider {
  sendEmail(data: ISendMailDTO): Promise<void>;
}
