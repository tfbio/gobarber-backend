import { container } from 'tsyringe';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import IUsersRepositories from '@modules/users/repositories/IUsersRepositories';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepositories from '@modules/notifications/infra/typeorm/repositories/NotificationsRepositories';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import LocalDiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/LocalDiskStorageProvider';

import IMailingProvider from '@shared/container/providers/MailingProvider/models/IMailingProvider';
import EtherealMailingProvider from '@shared/container/providers/MailingProvider/implementations/EtherealMailingProvider';

import UserTokenRepository from '@modules/users/infra/typeorm/repositories/UserTokenRepository';
import IUsersToken from '@modules/users/repositories/IUserTokensRepositories';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import RedisCacheProvider from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider';

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

container.registerSingleton<IUsersToken>(
  'UserTokenRepositories',
  UserTokenRepository
);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider
);

container.registerInstance<IMailingProvider>(
  'MailingProvider',
  container.resolve(EtherealMailingProvider)
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepositories
);

container.registerSingleton<ICacheProvider>(
  'CacheProvider',
  RedisCacheProvider
);
