import AppError from '@shared/errors/AppError';

import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticationService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('AuthenticateUser', () => {
  it('should be able to authenticate a user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider
    );
    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider
    );

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
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider
    );
    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider
    );

    await createUserService.execute({
      name: 'John',
      email: 'email@email.com',
      password: '123456',
    });

    expect(
      authenticateUserService.execute({
        email: 'email@email.com',
        password: '6546512',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate a non-existing user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider
    );

    expect(
      authenticateUserService.execute({
        email: 'email@email.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
