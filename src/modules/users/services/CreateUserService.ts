import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';

import Users from '@modules/users/infra/typeorm/entities/Users';

interface RequestDTO {
  name: string;
  password: string;
  email: string;
}

class CreateUserService {
  public async execute({ name, password, email }: RequestDTO): Promise<Users> {
    const repository = getRepository(Users);
    const checkifUserExists = await repository.findOne({
      where: { email },
    });

    if (checkifUserExists) {
      throw new AppError('Email already in use.');
    }

    const hashedPassword = await hash(password, 8);
    const newUser = repository.create({
      name,
      password: hashedPassword,
      email,
    });
    await repository.save(newUser);
    return newUser;
  }
}

export default CreateUserService;
