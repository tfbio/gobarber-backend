import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import ListProviderService from './ListProviderService';

let fakeUserRepository: FakeUserRepository;
let listProviderService: ListProviderService;

describe('ListProvider', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    listProviderService = new ListProviderService(fakeUserRepository);
  });

  it('should be able to list all providers', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'John',
      email: 'email@email.com',
      password: '123456',
    });

    const user2 = await fakeUserRepository.create({
      name: 'Rolf',
      email: 'email2@email.com',
      password: '123456',
    });

    const loggedUser = await fakeUserRepository.create({
      name: 'Lea',
      email: 'email3@email.com',
      password: '123456',
    });

    const providersList = await listProviderService.execute({
      user_id: loggedUser.id,
    });

    expect(providersList).toEqual([user1, user2]);
  });
});
