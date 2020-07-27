import AppError from '@shared/errors/AppError';

import CreateUserService from './CreateUserService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider
    );
  });
  it('should be able to create a new user', async () => {
    const newUser = await createUserService.execute({
      name: 'John',
      email: 'email@email.com',
      password: '123456',
    });

    expect(newUser).toHaveProperty('id');
  });

  it('should not be able to creat two users with same email', async () => {
    await createUserService.execute({
      name: 'Ralph',
      email: 'email@email.com',
      password: '123456',
    });

    await expect(
      createUserService.execute({
        name: 'John',
        email: 'email@email.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
