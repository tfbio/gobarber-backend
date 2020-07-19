import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUserTokensRepositories';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import AppError from '@shared/errors/AppError';

class FakeUsersTokensRepository implements IUsersRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const newUserToken = new UserToken();

    Object.assign(newUserToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(newUserToken);

    return newUserToken;
  }

  public async findByToken(token: string): Promise<UserToken> {
    const userToken = this.userTokens.find(
      thisToken => thisToken.token === token
    );
    if (!userToken) {
      throw new AppError('No token provided');
    }
    return userToken;
  }
}

export default FakeUsersTokensRepository;
