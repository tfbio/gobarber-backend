import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/DTOs/ICreateAppointmentDTO';
import IFindAllinOneMonthDTO from '@modules/appointments/DTOs/IFindAllinOneMonthDTO';
import IFindAllinOneDayDTO from '@modules/appointments/DTOs/IFindAllinOneDayDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const newAppointment = this.ormRepository.create({
      provider_id,
      date,
    });

    await this.ormRepository.save(newAppointment);
    return newAppointment;
  }

  public async findAll(): Promise<Appointment[]> {
    const appointmentsList = await this.ormRepository.find();

    return appointmentsList;
  }

  public async findAllinOneMonth({
    provider_id,
    month,
    year,
  }: IFindAllinOneMonthDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const appointmentList = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        ),
      },
    });
    return appointmentList;
  }

  public async findAllinOneDay({
    provider_id,
    day,
    month,
    year,
  }: IFindAllinOneDayDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointmentList = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
        ),
      },
    });
    return appointmentList;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppointment;
  }
}

export default AppointmentsRepository;
