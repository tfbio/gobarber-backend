import { container } from 'tsyringe';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import IUsersRepositories from '@modules/users/repositories/IUsersRepositories';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';

import IStorageProvider from '@shared/container/providers/models/IStorageProvider';
import LocalDiskStorageProvider from '@shared/container/providers/implementations/LocalDiskStorageProvider';

container.registerSingleton<IAppointmentRepository>(
  'AppointmentsRepository',
  AppointmentsRepository
);

container.registerSingleton<IUsersRepositories>(
  'UsersRepository',
  UsersRepository
);

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  LocalDiskStorageProvider
);
