import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticationService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let authenticateUserService: AuthenticateUserService;
let createUserService: CreateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    authenticateUserService = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider
    );
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider
    );
  });

  it('should be able to authenticate a user', async () => {
    await createUserService.execute({
      name: 'John',
      email: 'email@email.com',
      password: '123456',
    });
    const info = await authenticateUserService.execute({
      email: 'email@email.com',
      password: '123456',
    });

    expect(info).toHaveProperty('token');
  });

  it('should not be able to authenticate incorrect user/password match', async () => {
    await createUserService.execute({
      name: 'John',
      email: 'email@email.com',
      password: '123456',
    });

    await expect(
      authenticateUserService.execute({
        email: 'email@email.com',
        password: '6546512',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate a non-existing user', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'email@email.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
