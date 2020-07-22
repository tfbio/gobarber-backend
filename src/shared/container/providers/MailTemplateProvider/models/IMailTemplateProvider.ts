import IMailTemplateDTO from '../DTOs/IMailTemplateDTO';

export default interface IMailTemplateProvider {
  parse(data: IMailTemplateDTO): Promise<string>;
}
