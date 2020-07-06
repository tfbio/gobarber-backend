import Appointment from '../infra/typeorm/entities/Appointments';

export default interface IAppointmentRepository {
  findByDate(date: Date): Promise<Appointment | undefined>;
}
