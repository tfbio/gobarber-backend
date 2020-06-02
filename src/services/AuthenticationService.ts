import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authconfig from '../config/auth';
import AppError from '../errors/AppError';

import User from '../models/Users';

interface ResquestDTO {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class Authentication {
  public async execute({ email, password }: ResquestDTO): Promise<Response> {
    const repository = getRepository(User);

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
