import { getMongoRepository, MongoRepository } from 'typeorm';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Notifications from '@modules/notifications/infra/typeorm/schemas/Notifications';

import ICreateNotificationDTO from '@modules/notifications/DTOs/ICreateNotificationDTO';

class NotificationsRepositories implements INotificationsRepository {
  private ormRepository: MongoRepository<Notifications>;

  constructor() {
    this.ormRepository = getMongoRepository(Notifications);
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notifications> {
    const notification = this.ormRepository.create({ content, recipient_id });

    await this.ormRepository.save(notification);
    return notification;
  }
}

export default NotificationsRepositories;
