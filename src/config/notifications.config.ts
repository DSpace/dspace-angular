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
  @Config.publish() rtl: boolean;
  @Config.publish() position: ['top' | 'bottom' | 'middle', 'right' | 'left' | 'center'];
  @Config.publish() maxStack: number;
  @Config.publish() timeOut: number;
  @Config.publish() clickToClose: boolean;
  @Config.publish() animate: NotificationAnimationsType;
}
