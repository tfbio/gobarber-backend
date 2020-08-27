import 'reflect-metadata';

import { startOfHour, getHours, isBefore, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
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
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const checkDuplicateSchedule = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id
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

    await this.cacheProvider.invalidate(
      `provider-appointments-list:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d'
      )}`
    );

    return newAppointment;
  }
}

export default CreateAppointmentService;
