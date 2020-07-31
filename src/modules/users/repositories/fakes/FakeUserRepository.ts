import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepositories';

import ICreateAppointmentDTO from '@modules/users/DTOs/ICreateUserDTO';
import Users from '@modules/users/infra/typeorm/entities/Users';

class FakeUsersRepository implements IUsersRepository {
  private users: Users[] = [];

  public async create({
    name,
    email,
    password,
  }: ICreateAppointmentDTO): Promise<Users> {
    const newUser = new Users();

    newUser.id = uuid();
    newUser.name = name;
    newUser.email = email;
    newUser.password = password;

    this.users.push(newUser);

    return newUser;
  }

  public async save(user: Users): Promise<Users> {
    const userIndex = this.users.findIndex(
      userFound => userFound.id === user.id
    );

    this.users[userIndex] = user;
    return user;
  }

  public async findById(id: string): Promise<Users | undefined> {
    const userFound = this.users.find(user => user.id === id);
    return userFound;
  }

  public async findByEmail(email: string): Promise<Users | undefined> {
    const userFound = this.users.find(user => user.email === email);
    return userFound;
  }

  public async findAllProviders(except_id?: string): Promise<Users[]> {
    let usersList = this.users;

    if (except_id) {
      usersList = this.users.filter(users => users.id !== except_id);
    }

    return usersList;
  }
}

export default FakeUsersRepository;
