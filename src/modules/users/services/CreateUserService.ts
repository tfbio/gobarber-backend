import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Users from '@modules/users/infra/typeorm/entities/Users';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
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
    private hashProvider: IHashProvider
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
    return newUser;
  }
}

export default CreateUserService;
