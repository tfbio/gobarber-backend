import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';

describe('CreateAppointment', () => {
  const fakeRepository = new FakeAppointmentRepository();
  const createAppointmentService = new CreateAppointmentService(fakeRepository);

  it('should create a new appoitment', async () => {
    const newAppointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '4421654987',
    });
    expect(newAppointment).toHaveProperty('id');
    expect(newAppointment.provider_id).toBe('4421654987');
  });
});
