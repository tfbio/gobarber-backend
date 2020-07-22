import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IMailTemplateDTO from '../DTOs/IMailTemplateDTO';

class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse({ template }: IMailTemplateDTO): Promise<string> {
    return template;
  }
}

export default FakeMailTemplateProvider;
