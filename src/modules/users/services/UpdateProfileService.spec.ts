import AppError from '@shared/errors/AppError';

import UpdateProfileService from './UpdateProfileService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider
    );
  });

  it('should be able to update name and email info', async () => {
    const user = await fakeUserRepository.create({
      name: 'John',
      email: 'email@email.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Holler',
      email: 'email2@hotmail.com',
    });

    expect(updatedUser.name).toBe('Holler');
    expect(updatedUser.email).toBe('email2@hotmail.com');
  });

  it('should be able to change password providing correct old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John',
      email: 'email@email.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John',
      email: 'email@email.com',
      newPassword: '456123',
      oldPassword: '123456',
    });

    expect(updatedUser.password).toBe('456123');
  });

  it('should not be able to update email to an email adress already in use', async () => {
    const user = await fakeUserRepository.create({
      name: 'John',
      email: 'email@email.com',
      password: '123456',
    });

    await fakeUserRepository.create({
      name: 'Jorge',
      email: 'email2@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Holler',
        email: 'email2@email.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change password without providing correct last password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John',
      email: 'email@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John',
        email: 'email@email.com',
        newPassword: '456123',
        oldPassword: 'incorrect old password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change password into the current one', async () => {
    const user = await fakeUserRepository.create({
      name: 'John',
      email: 'email@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Holler',
        email: 'email2@hotmail.com',
        newPassword: '123456',
        oldPassword: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
