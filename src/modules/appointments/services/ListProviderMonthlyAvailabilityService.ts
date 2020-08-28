import 'reflect-metadata';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  availability: boolean;
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

    const availability = forEachDayArray.map(day => {
      const comparedDate = new Date(year, month - 1, day, 23, 59, 59);

      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        availability:
          isAfter(comparedDate, new Date()) && appointmentsInDay.length < 11,
        day,
      };
    });

    return availability;
  }
}

export default ListProviderMonthlyAvailabilityService;
