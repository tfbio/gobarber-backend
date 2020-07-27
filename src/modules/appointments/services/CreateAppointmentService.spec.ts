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
    const newAppointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '4421654987',
    });
    expect(newAppointment).toHaveProperty('id');
    expect(newAppointment.provider_id).toBe('4421654987');
  });

  it('should not create two appointment with the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);
    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '4421654987',
    });

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '4421654987',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
