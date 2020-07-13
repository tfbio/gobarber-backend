import { uuid } from 'uuidv4';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/DTOs/ICreateAppointmentDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointment: Appointment[] = [];

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const newAppointment = new Appointment();

    // Object.assign(this.appointment, { id: uuid(), provider_id, date });
    newAppointment.id = uuid();
    newAppointment.provider_id = provider_id;
    newAppointment.date = date;

    this.appointment.push(newAppointment);

    return newAppointment;
  }

  public async findAll(): Promise<Appointment[]> {
    return this.appointment;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const foundAppointment = this.appointment.find(
      appointment => appointment.date === date
    );

    return foundAppointment;
  }
}

export default FakeAppointmentsRepository;
