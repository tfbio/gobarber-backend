import Appointment from '../infra/typeorm/entities/Appointments';

import ICreateAppointmentDTO from '../DTOs/ICreateAppointmentDTO';

export default interface IAppointmentRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}
