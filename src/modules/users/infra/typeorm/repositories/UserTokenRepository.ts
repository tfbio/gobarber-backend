import { getRepository, Repository } from 'typeorm';

import IUsersToken from '@modules/users/repositories/IUserTokensRepositories';
import UserToken from '../entities/UserToken';

class UserTokenRepository implements IUsersToken {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id,
    });

    await this.ormRepository.save(userToken);
    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const tokenFound = this.ormRepository.findOne({
      where: { token },
    });

    return tokenFound;
  }
}

export default UserTokenRepository;
