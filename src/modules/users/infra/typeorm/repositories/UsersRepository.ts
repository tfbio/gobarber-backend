import { getRepository, Repository, Not } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepositories';

import ICreateAppointmentDTO from '@modules/users/DTOs/ICreateUserDTO';
import IFindAllProviderDTO from '@modules/users/DTOs/IFindAllProviderDTO';

import Users from '../entities/Users';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<Users>;

  constructor() {
    this.ormRepository = getRepository(Users);
  }

  public async create({
    name,
    email,
    password,
  }: ICreateAppointmentDTO): Promise<Users> {
    const newUser = this.ormRepository.create({
      name,
      email,
      password,
    });

    await this.ormRepository.save(newUser);
    return newUser;
  }

  public async save(user: Users): Promise<Users> {
    return this.ormRepository.save(user);
  }

  public async findById(id: string): Promise<Users | undefined> {
    const user = this.ormRepository.findOne({ where: { id } });

    return user;
  }

  public async findByEmail(email: string): Promise<Users | undefined> {
    const user = this.ormRepository.findOne({ where: { email } });

    return user;
  }

  public async findAllProviders({
    except_id,
  }: IFindAllProviderDTO): Promise<Users[]> {
    let usersList: Users[];

    if (except_id) {
      usersList = await this.ormRepository.find({
        where: Not(except_id),
      });
    } else {
      usersList = await this.ormRepository.find();
    }
    return usersList;
  }
}

export default UsersRepository;
