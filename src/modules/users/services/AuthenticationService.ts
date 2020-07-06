import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authconfig from '@config/auth';
import AppError from '@shared/errors/AppError';

import Users from '@modules/users/infra/typeorm/entities/Users';

interface ResquestDTO {
  email: string;
  password: string;
}

interface Response {
  user: Users;
  token: string;
}

class Authentication {
  public async execute({ email, password }: ResquestDTO): Promise<Response> {
    const repository = getRepository(Users);

    const user = await repository.findOne({ where: { email } });
    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError('Incorrect email/password combination', 401);
    }
    const { secret, expiresIn } = authconfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });
    return { user, token };
  }
}

export default Authentication;
