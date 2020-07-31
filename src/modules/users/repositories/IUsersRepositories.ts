import Users from '../infra/typeorm/entities/Users';
import ICreateUserDTO from '../DTOs/ICreateUserDTO';

export default interface IUsersRepositories {
  create(data: ICreateUserDTO): Promise<Users>;
  save(user: Users): Promise<Users>;
  findByEmail(email: string): Promise<Users | undefined>;
  findById(id: string): Promise<Users | undefined>;
  findAllProviders(except_id?: string): Promise<Users[]>;
}
