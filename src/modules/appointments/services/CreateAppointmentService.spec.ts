import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository';

let fakeRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointmentService = new CreateAppointmentService(
      fakeRepository,
      fakeNotificationsRepository,
      fakeCacheProvider
    );
  });
  it('should create a new appoitment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 20, 11).getTime();
    });

    const newAppointment = await createAppointmentService.execute({
      date: new Date(2020, 6, 20, 15),
      provider_id: 'provider-id',
      user_id: 'user-id',
    });
    expect(newAppointment).toHaveProperty('id');
    expect(newAppointment.provider_id).toBe('provider-id');
  });

  it('should not be able to create two appointment with the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 20, 11).getTime();
    });

    const appointmentDate = new Date(2020, 6, 20, 16);
    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: 'provider-id',
      user_id: 'user-id',
    });

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: 'provider-id',
        user_id: 'user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment in a past time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 20, 11).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 6, 20, 9),
        provider_id: 'provider-id',
        user_id: 'user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 20, 11).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 6, 20, 15),
        provider_id: 'same-user-id',
        user_id: 'same-user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment outside daily time boundry', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 19, 11).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 6, 20, 6),
        provider_id: 'provider-id',
        user_id: 'user-id',
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 6, 20, 20),
        provider_id: 'provider-id',
        user_id: 'user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
