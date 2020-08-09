import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository';

let fakeRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(fakeRepository);
  });
  it('should create a new appoitment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 20, 11).getTime();
    });

    const newAppointment = await createAppointmentService.execute({
      date: new Date(2020, 6, 20, 15),
      provider_id: '4421654987',
      user_id: '1321156458',
    });
    expect(newAppointment).toHaveProperty('id');
    expect(newAppointment.provider_id).toBe('4421654987');
  });

  it('should not be able to create two appointment with the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 20, 11).getTime();
    });

    const appointmentDate = new Date(2020, 6, 20, 16);
    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '4421654987',
      user_id: '1321156458',
    });

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '4421654987',
        user_id: '1321156458',
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
        provider_id: '4421654987',
        user_id: '1321156458',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
