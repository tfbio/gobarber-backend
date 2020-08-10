import 'reflect-metadata';
// Eu adicionei este import acima para resolver problema nos testes jest, deixar em observação esta linha
import { startOfHour, getHours, isBefore, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
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
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const checkDuplicateSchedule = await this.appointmentsRepository.findByDate(
      appointmentDate
    );

    if (checkDuplicateSchedule) {
      throw new AppError('This appointment time is already booked.');
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('That time for appointment has already passed.');
    }

    if (user_id === provider_id) {
      throw new AppError(
        'Not permitted to create an appointment with yourself.'
      );
    }

    const hourBoundryCheck = getHours(date);
    if (hourBoundryCheck < 7 || hourBoundryCheck > 17) {
      throw new AppError(
        'Selected hour is outside of daily schedule boundries'
      );
    }

    const newAppointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const formattedDate = format(appointmentDate, "yyyy/MM/dd 'at' HH:mm");
    await this.notificationsRepository.create({
      content: `New appointment created to date ${formattedDate}`,
      recipient_id: provider_id,
    });

    return newAppointment;
  }
}

export default CreateAppointmentService;
