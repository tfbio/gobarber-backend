import ListProviderMonthlyAvailabilityService from './ListProviderMonthlyAvailabilityService';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderMonthlyAvailability: ListProviderMonthlyAvailabilityService;

describe('ListProviderMonthlyAvailability', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderMonthlyAvailability = new ListProviderMonthlyAvailabilityService(
      fakeAppointmentRepository
    );
  });

  it('should be able to list all providers', async () => {
    await fakeAppointmentRepository.create({
      date: new Date(2020, 6, 20, 7, 0, 0),
      provider_id: 'user',
    });

    await fakeAppointmentRepository.create({
      date: new Date(2020, 6, 20, 8, 0, 0),
      provider_id: 'user',
    });

    await fakeAppointmentRepository.create({
      date: new Date(2020, 6, 20, 9, 0, 0),
      provider_id: 'user',
    });

    await fakeAppointmentRepository.create({
      date: new Date(2020, 6, 20, 10, 0, 0),
      provider_id: 'user',
    });
    await fakeAppointmentRepository.create({
      date: new Date(2020, 6, 20, 11, 0, 0),
      provider_id: 'user',
    });

    await fakeAppointmentRepository.create({
      date: new Date(2020, 6, 20, 12, 0, 0),
      provider_id: 'user',
    });

    await fakeAppointmentRepository.create({
      date: new Date(2020, 6, 20, 13, 0, 0),
      provider_id: 'user',
    });

    await fakeAppointmentRepository.create({
      date: new Date(2020, 6, 20, 14, 0, 0),
      provider_id: 'user',
    });

    await fakeAppointmentRepository.create({
      date: new Date(2020, 6, 20, 15, 0, 0),
      provider_id: 'user',
    });

    await fakeAppointmentRepository.create({
      date: new Date(2020, 6, 20, 16, 0, 0),
      provider_id: 'user',
    });

    await fakeAppointmentRepository.create({
      date: new Date(2020, 6, 20, 17, 0, 0),
      provider_id: 'user',
    });

    await fakeAppointmentRepository.create({
      date: new Date(2020, 6, 21, 8, 0, 0),
      provider_id: 'user',
    });

    const availability = await listProviderMonthlyAvailability.execute({
      provider_id: 'user',
      year: 2020,
      month: 7,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, availability: true },
        { day: 20, availability: false },
        { day: 21, availability: true },
        { day: 22, availability: true },
      ])
    );
  });
});
