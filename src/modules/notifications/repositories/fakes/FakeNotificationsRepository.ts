// import { ObjectId } from 'mongodb';
import { ObjectId } from 'mongodb';

import INotificationsRepository from '../INotificationsRepository';
import Notifications from '../../infra/typeorm/schemas/Notifications';

import ICreateNotificationDTO from '../../DTOs/ICreateNotificationDTO';

class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notifications[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notifications> {
    const notification = new Notifications();

    Object.assign(notification, {
      id: new ObjectId(),
      content,
      recipient_id,
    });

    this.notifications.push(notification);
    return notification;
  }
}

export default FakeNotificationsRepository;
