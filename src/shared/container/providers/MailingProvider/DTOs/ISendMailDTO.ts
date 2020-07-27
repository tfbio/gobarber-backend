import IMailTemplateDTO from '../../MailTemplateProvider/DTOs/IMailTemplateDTO';

interface IMailContact {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IMailTemplateDTO;
}
