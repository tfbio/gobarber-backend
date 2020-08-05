import 'reflect-metadata';
import { getDaysInMonth, getDate } from 'date-fns';

import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  availabilty: boolean;
}>;

@injectable()
class ListProviderMonthlyAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllinOneMonth({
      provider_id,
      year,
      month,
    });

    const daysInMonth = getDaysInMonth(new Date(year, month - 1));
    const forEachDayArray = Array.from(
      { length: daysInMonth },
      (value, index) => index + 1
    );

    const availabilty = forEachDayArray.map(day => {
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        availabilty: appointmentsInDay.length < 11,
        day,
      };
    });

    return availabilty;
  }
}

export default ListProviderMonthlyAvailabilityService;
