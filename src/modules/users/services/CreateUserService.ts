import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Users from '@modules/users/infra/typeorm/entities/Users';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../repositories/IUsersRepositories';

interface IRequestDTO {
  name: string;
  password: string;
  email: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({ name, password, email }: IRequestDTO): Promise<Users> {
    const checkifUserExists = await this.usersRepository.findByEmail(email);

    if (checkifUserExists) {
      throw new AppError('Email already in use.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);
    const newUser = await this.usersRepository.create({
      name,
      password: hashedPassword,
      email,
    });

    await this.cacheProvider.invalidatePrefix('providers-list');

    return newUser;
  }
}

export default CreateUserService;
