import Appointment from '../infra/typeorm/entities/Appointments';

import ICreateAppointmentDTO from '../DTOs/ICreateAppointmentDTO';
import IFindAllinOneMonthDTO from '../DTOs/IFindAllinOneMonthDTO';
import IFindAllinOneDayDTO from '../DTOs/IFindAllinOneDayDTO';

export default interface IAppointmentRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findAll(): Promise<Appointment[]>;
  findAllinOneMonth(data: IFindAllinOneMonthDTO): Promise<Appointment[]>;
  findAllinOneDay(data: IFindAllinOneDayDTO): Promise<Appointment[]>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
}
