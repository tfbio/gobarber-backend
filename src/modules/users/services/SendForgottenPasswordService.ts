import 'reflect-metadata';
import path from 'path';

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

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs'
    );

    await this.mailingProvider.sendEmail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] Password Recovery',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset?token=${token}`,
        },
      },
    });
  }
}

export default SendForgottenPasswordService;
