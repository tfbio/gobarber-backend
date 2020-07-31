import Users from '../infra/typeorm/entities/Users';
import ICreateUserDTO from '../DTOs/ICreateUserDTO';
import IFindAllProviderDTO from '../DTOs/IFindAllProviderDTO';

export default interface IUsersRepositories {
  create(data: ICreateUserDTO): Promise<Users>;
  save(user: Users): Promise<Users>;
  findByEmail(email: string): Promise<Users | undefined>;
  findById(id: string): Promise<Users | undefined>;
  findAllProviders(data: IFindAllProviderDTO): Promise<Users[]>;
}
