import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointments';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    let appointmentsList = await this.cacheProvider.retrieve<Appointment[]>(
      `provider-appointments-list:${provider_id}:${year}-${month}-${day}`
    );

    if (!appointmentsList) {
      appointmentsList = await this.appointmentsRepository.findAllinOneDay({
        provider_id,
        day,
        month,
        year,
      });

      await this.cacheProvider.save(
        `provider-appointments-list:${provider_id}:${year}-${month}-${day}`,
        classToClass(appointmentsList)
      );
    }

    return appointmentsList;
  }
}

export default ListProviderAppointmentsService;
