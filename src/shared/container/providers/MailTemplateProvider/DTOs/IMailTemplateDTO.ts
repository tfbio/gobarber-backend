interface ITemplateVariable {
  [key: string]: string | number;
}

export default interface IMailTemplateDTO {
  file: string;
  variables: ITemplateVariable;
}
