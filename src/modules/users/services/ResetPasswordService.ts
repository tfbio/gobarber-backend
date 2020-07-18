import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepositories';
import IUserTokensRepositories from '../repositories/IUserTokensRepositories';

interface IRequestDTO {
  password: string;
  token: string;
}

@injectable()
class SendForgottenPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('userTokenRepositories')
    private userTokenRepositories: IUserTokensRepositories
  ) {}

  public async execute({ password, token }: IRequestDTO): Promise<void> {
    const userToken = await this.userTokenRepositories.findByToken(token);

    if (!userToken) {
      throw new AppError('User Token does not exists');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    user.password = password;
    this.usersRepository.save(user);
  }
}

export default SendForgottenPasswordService;
