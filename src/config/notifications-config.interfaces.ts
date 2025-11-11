import { Config } from './config.interface';

export enum NotificationAnimationsType {
  Fade = 'fade',
  FromTop = 'fromTop',
  FromRight = 'fromRight',
  FromBottom = 'fromBottom',
  FromLeft = 'fromLeft',
  Rotate = 'rotate',
  Scale = 'scale'
}

export enum NotificationAnimationsStatus {
  In = 'In',
  Out = 'Out'
}

export interface INotificationBoardOptions extends Config {
  rtl: boolean;
  position: ['top' | 'bottom' | 'middle', 'right' | 'left' | 'center'];
  maxStack: number;
  timeOut: number;
  clickToClose: boolean;
  animate: NotificationAnimationsType;
}
