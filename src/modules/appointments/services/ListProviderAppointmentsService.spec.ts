import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentRepository,
      fakeCacheProvider
    );
  });

  it('should be able to list the appointments of a provider for a given day', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 20, 11, 0, 0).getTime();
    });

    const appointment1 = await fakeAppointmentRepository.create({
      date: new Date(2020, 6, 20, 15, 0, 0),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    const appointment2 = await fakeAppointmentRepository.create({
      date: new Date(2020, 6, 20, 17, 0, 0),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider_id',
      day: 20,
      month: 7,
      year: 2020,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
