import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

let fakeUserRepository: FakeUserRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    showProfileService = new ShowProfileService(fakeUserRepository);
  });

  it('should be able to show profile info', async () => {
    const user = await fakeUserRepository.create({
      name: 'John',
      email: 'email@email.com',
      password: '123456',
    });

    const profile = await showProfileService.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('John');
    expect(profile.email).toBe('email@email.com');
  });

  it('should not be able to show profile of non-existent user', async () => {
    await expect(
      showProfileService.execute({
        user_id: 'non-existent-user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
