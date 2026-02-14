import { Config } from './config';

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

export class INotificationBoardOptions extends Config {
  @Config.public rtl = false;
  @Config.public position: ['top' | 'bottom' | 'middle', 'right' | 'left' | 'center'] = [
    'top', 'right',
  ];
  // NOTE: after how many seconds notification is closed automatically. If set to zero notifications are not closed automatically
  @Config.public maxStack = 8;
  @Config.public timeOut = 5000; // 5 second
  @Config.public clickToClose = true;
  @Config.public animate: NotificationAnimationsType = NotificationAnimationsType.Scale;
}
