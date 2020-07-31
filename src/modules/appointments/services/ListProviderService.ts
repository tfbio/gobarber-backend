import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import Users from '@modules/users/infra/typeorm/entities/Users';
import IUsersRepository from '@modules/users/repositories/IUsersRepositories';

interface IRequestDTO {
  user_id: string;
}

@injectable()
class ListProviderService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ user_id }: IRequestDTO): Promise<Users[]> {
    const user = await this.usersRepository.findAllProviders({
      except_id: user_id,
    });

    return user;
  }
}

export default ListProviderService;
