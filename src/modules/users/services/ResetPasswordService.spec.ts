import AppError from '@shared/errors/AppError';

import ResetPasswordService from './ResetPasswordService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeBCryptHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeBCryptHashProvider;

let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeBCryptHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    );
  });

  it('should be able to reset a password with email given', async () => {
    const user = await fakeUserRepository.create({
      name: 'John',
      email: 'email@email.com',
      password: '123456',
    });

    const newToken = await fakeUserTokensRepository.generate(user.id);
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      password: '654987',
      token: newToken.token,
    });

    const updatedUser = await fakeUserRepository.findById(user.id);

    expect(generateHash).toBeCalledWith('654987');
    expect(updatedUser?.password).toBe('654987');
  });

  it('should not be able to reset a password without a token', async () => {
    await expect(
      resetPasswordService.execute({
        password: '654987',
        token: 'non-existent-token',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset a password for a non-existent user', async () => {
    const newToken = await fakeUserTokensRepository.generate(
      'non-existing-user'
    );

    await expect(
      resetPasswordService.execute({
        password: '654987',
        token: newToken.token,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset a password with expired token (48 hours)', async () => {
    const user = await fakeUserRepository.create({
      name: 'John',
      email: 'email@email.com',
      password: '123456',
    });

    const newToken = await fakeUserTokensRepository.generate(user.id);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 49);
    });

    await expect(
      resetPasswordService.execute({
        password: '654987',
        token: newToken.token,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
