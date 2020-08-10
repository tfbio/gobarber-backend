import ICreateNotificationDTO from '../DTOs/ICreateNotificationDTO';
import Notifications from '../infra/typeorm/schemas/Notifications';

export default interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notifications>;
}
