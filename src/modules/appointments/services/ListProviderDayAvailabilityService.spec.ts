import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentRepository
    );
  });

  it('should be able to list hourly availability in one day', async () => {
    await fakeAppointmentRepository.create({
      date: new Date(2020, 6, 20, 8, 0, 0),
      provider_id: 'user',
    });

    await fakeAppointmentRepository.create({
      date: new Date(2020, 6, 20, 10, 0, 0),
      provider_id: 'user',
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'user',
      day: 20,
      month: 7,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, availability: false },
        { hour: 10, availability: false },
        { hour: 17, availability: true },
      ])
    );
  });
});
