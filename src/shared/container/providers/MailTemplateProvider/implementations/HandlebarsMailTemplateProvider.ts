import handlebars from 'handlebars';

import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IMailTemplateDTO from '../DTOs/IMailTemplateDTO';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({
    template,
    variables,
  }: IMailTemplateDTO): Promise<string> {
    const parseTemplate = handlebars.compile(template);

    return parseTemplate(variables);
  }
}

export default HandlebarsMailTemplateProvider;
