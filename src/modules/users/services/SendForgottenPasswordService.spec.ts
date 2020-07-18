import FakeMailingProvider from '@shared/container/providers/MailingProvider/fakes/FakeMailingProvider';

import AppError from '@shared/errors/AppError';

import SendForgottenPasswordService from './SendForgottenPasswordService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUserRepository: FakeUserRepository;
let fakeMailingProvider: FakeMailingProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;

let sendForgottenPasswordService: SendForgottenPasswordService;

describe('SendForgottenPassword', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeMailingProvider = new FakeMailingProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgottenPasswordService = new SendForgottenPasswordService(
      fakeUserRepository,
      fakeUserTokensRepository,
      fakeMailingProvider
    );
  });

  it('should be able to recover a password with email given', async () => {
    const sendEmail = jest.spyOn(fakeMailingProvider, 'sendEmail');

    const user = await fakeUserRepository.create({
      name: 'John',
      email: 'email@email.com',
      password: '123456',
    });

    await sendForgottenPasswordService.execute({
      email: user.email,
    });

    expect(sendEmail).toBeCalled();
  });

  it('should not be able send message to non-existent/invalid email', async () => {
    await expect(
      sendForgottenPasswordService.execute({
        email: 'notRegisteredEmail@email.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to generate a recovery token', async () => {
    const generate = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUserRepository.create({
      name: 'John',
      email: 'email@email.com',
      password: '123456',
    });

    await sendForgottenPasswordService.execute({
      email: user.email,
    });

    expect(generate).toBeCalledWith(user.id);
  });
});
