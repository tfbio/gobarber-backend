import 'reflect-metadata';
import { getHours, isAfter } from 'date-fns';

import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  availability: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllinOneDay({
      provider_id,
      day,
      month,
      year,
    });

    const workHourStart = 7;
    const forEachHour = Array.from(
      { length: 11 },
      (_, index) => index + workHourStart
    );

    const currentDate = new Date(Date.now());

    const availability = forEachHour.map(hour => {
      const appointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour
      );
      const appointmentDate = new Date(year, month - 1, day, hour);

      const dateCompare = isAfter(appointmentDate, currentDate);

      return {
        hour,
        availability: !appointmentInHour && dateCompare,
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
