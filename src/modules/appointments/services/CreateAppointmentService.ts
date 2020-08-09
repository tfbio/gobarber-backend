import 'reflect-metadata';
// Eu adicionei este import acima para resolver problema nos testes jest, deixar em observação esta linha
import { startOfHour, isBefore } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointments';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private AppointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const checkDuplicateSchedule = await this.AppointmentsRepository.findByDate(
      appointmentDate
    );

    if (checkDuplicateSchedule) {
      throw new AppError('This appointment time is already booked');
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('That time for appointment has already passed');
    }

    const newAppointment = await this.AppointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    return newAppointment;
  }
}

export default CreateAppointmentService;
