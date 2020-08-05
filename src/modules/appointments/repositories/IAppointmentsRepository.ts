import Appointment from '../infra/typeorm/entities/Appointments';

import ICreateAppointmentDTO from '../DTOs/ICreateAppointmentDTO';
import IFindAllinOneMonthDTO from '../DTOs/IFindAllinOneMonthDTO';

export default interface IAppointmentRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findAll(): Promise<Appointment[]>;
  findAllinOneMonth(data: IFindAllinOneMonthDTO): Promise<Appointment[]>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}
