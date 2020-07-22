import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IMailingProvider from '@shared/container/providers/MailingProvider/models/IMailingProvider';
import IUserTokensRepositories from '../repositories/IUserTokensRepositories';
import IUsersRepository from '../repositories/IUsersRepositories';

interface IRequestDTO {
  email: string;
}

@injectable()
class SendForgottenPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokenRepositories')
    private userTokenRepositories: IUserTokensRepositories,

    @inject('MailingProvider')
    private mailingProvider: IMailingProvider
  ) {}

  public async execute({ email }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email is invalid or not registered');
    }

    const { token } = await this.userTokenRepositories.generate(user.id);

    await this.mailingProvider.sendEmail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] Password Recovery',
      templateData: {
        template: 'Olá, {{name}}, {{token}}',
        variables: {
          name: user.name,
          token,
        },
      },
    });
  }
}

export default SendForgottenPasswordService;
