import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const createUserService = new CreateUserService(fakeUserRepository);

    const newUser = await createUserService.execute({
      name: 'John',
      email: 'email@email.com',
      password: '123456',
    });

    expect(newUser).toHaveProperty('id');
  });

  it('should not be able to creat two users with same email', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const createUserService = new CreateUserService(fakeUserRepository);

    await createUserService.execute({
      name: 'Ralph',
      email: 'email@email.com',
      password: '123456',
    });

    expect(
      createUserService.execute({
        name: 'John',
        email: 'email@email.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
