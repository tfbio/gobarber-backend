import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import Users from '@modules/users/infra/typeorm/entities/Users';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepositories';

interface IRequestDTO {
  user_id: string;
  name: string;
  email: string;
  oldPassword?: string;
  newPassword?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    user_id,
    name,
    email,
    newPassword,
    oldPassword,
  }: IRequestDTO): Promise<Users> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const userEmailCheck = await this.usersRepository.findByEmail(email);
    if (userEmailCheck && userEmailCheck.id !== user_id) {
      throw new AppError('Email already in use.');
    }

    if (newPassword && !oldPassword) {
      throw new AppError('old password must be provided to change password');
    }

    if (newPassword && newPassword === oldPassword) {
      throw new AppError('Cannot change password into the current one.');
    }

    if (newPassword && oldPassword) {
      const passwordsCompare = await this.hashProvider.compareHash(
        oldPassword,
        user.password
      );
      if (!passwordsCompare) {
        throw new AppError('Need to provide correct old password');
      }

      user.password = await this.hashProvider.generateHash(newPassword);
    }

    user.name = name;
    user.email = email;

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
