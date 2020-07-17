import FakeMailingProvider from '@shared/container/providers/MailingProvider/fakes/FakeMailingProvider';
import AppError from '@shared/errors/AppError';
import SendForgottenPasswordService from './SendForgottenPasswordService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

describe('SendForgottenPassword', () => {
  it('should be able to recover a password with email given', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeMailingProvider = new FakeMailingProvider();

    const sendForgottenPasswordService = new SendForgottenPasswordService(
      fakeUserRepository,
      fakeMailingProvider
    );

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
    const fakeUserRepository = new FakeUserRepository();
    const fakeMailingProvider = new FakeMailingProvider();

    const sendForgottenPasswordService = new SendForgottenPasswordService(
      fakeUserRepository,
      fakeMailingProvider
    );

    expect(
      sendForgottenPasswordService.execute({
        email: 'notRegisteredEmail@email.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
