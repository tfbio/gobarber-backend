import { container } from 'tsyringe';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import IUsersRepositories from '@modules/users/repositories/IUsersRepositories';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

container.registerSingleton<IAppointmentRepository>(
  'AppointmentsRepository',
  AppointmentsRepository
);

container.registerSingleton<IUsersRepositories>(
  'UsersRepository',
  UsersRepository
);
