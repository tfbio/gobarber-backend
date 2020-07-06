import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointments';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequestDTO {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({
    provider_id,
    date,
  }: RequestDTO): Promise<Appointment> {
    const repository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);
    const checkDuplicateSchedule = await repository.findByDate(appointmentDate);

    if (checkDuplicateSchedule !== null) {
      throw new AppError('This appointment time is already booked');
    }

    const newAppointment = repository.create({
      provider_id,
      date: appointmentDate,
    });
    await repository.save(newAppointment);

    return newAppointment;
  }
}

export default CreateAppointmentService;
