import { NotificationAnimationsType } from '../app/shared/notifications/models/notification-animations-type';
import { Config } from './config.interface';

export interface INotificationBoardOptions extends Config {
  rtl: boolean;
  position: ['top' | 'bottom' | 'middle', 'right' | 'left' | 'center'];
  maxStack: number;
  timeOut: number;
  clickToClose: boolean;
  animate: NotificationAnimationsType;
}
