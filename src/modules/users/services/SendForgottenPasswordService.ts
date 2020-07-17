import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';
/*
import AppError from '@shared/errors/AppError';
import Users from '@modules/users/infra/typeorm/entities/Users';
*/
import IMailingProvider from '@shared/container/providers/MailingProvider/models/IMailingProvider';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepositories';

interface IRequestDTO {
  email: string;
}

@injectable()
class SendForgottenPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailingProvider')
    private mailingProvider: IMailingProvider
  ) {}

  public async execute({ email }: IRequestDTO): Promise<void> {
    const verifyEmail = await this.usersRepository.findByEmail(email);
    if (!verifyEmail) {
      throw new AppError('Email is invalid or not registered');
    }

    await this.mailingProvider.sendEmail(email, 'test email content');
  }
}

export default SendForgottenPasswordService;
