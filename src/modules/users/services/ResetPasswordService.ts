import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepositories';
import IUserTokensRepositories from '../repositories/IUserTokensRepositories';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  password: string;
  token: string;
}

@injectable()
class SendForgottenPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokenRepositories')
    private userTokenRepositories: IUserTokensRepositories,

    @inject('HashProvider')
    private hashProvider: IHashProvider
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

    const tokenCreatedAt = userToken.created_at;
    const compareHours = addHours(tokenCreatedAt, 48);

    if (isAfter(Date.now(), compareHours)) {
      throw new AppError('token expired.');
    }

    user.password = await this.hashProvider.generateHash(password);
    this.usersRepository.save(user);
  }
}

export default SendForgottenPasswordService;
