import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/DTOs/ICreateAppointmentDTO';
import IFindAllinOneMonthDTO from '@modules/appointments/DTOs/IFindAllinOneMonthDTO';
import IFindAllinOneDayDTO from '@modules/appointments/DTOs/IFindAllinOneDayDTO';

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

  public async findAllinOneMonth({
    provider_id,
    month,
    year,
  }: IFindAllinOneMonthDTO): Promise<Appointment[]> {
    const appointmentList = this.appointment.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      );
    });

    return appointmentList;
  }

  public async findAllinOneDay({
    provider_id,
    day,
    month,
    year,
  }: IFindAllinOneDayDTO): Promise<Appointment[]> {
    const appointmentList = this.appointment.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      );
    });

    return appointmentList;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const foundAppointment = this.appointment.find(appointment =>
      isEqual(appointment.date, date)
    );

    return foundAppointment;
  }
}

export default FakeAppointmentsRepository;
