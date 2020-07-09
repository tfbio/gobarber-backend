import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Users from '@modules/users/infra/typeorm/entities/Users';
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
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ name, password, email }: IRequestDTO): Promise<Users> {
    const checkifUserExists = await this.usersRepository.findByEmail(email);

    if (checkifUserExists) {
      throw new AppError('Email already in use.');
    }

    const hashedPassword = await hash(password, 8);
    const newUser = await this.usersRepository.create({
      name,
      password: hashedPassword,
      email,
    });
    return newUser;
  }
}

export default CreateUserService;
