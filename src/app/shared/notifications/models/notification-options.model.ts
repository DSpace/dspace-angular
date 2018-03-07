import { NotificationAnimationsType } from './notification-animations-type';

export interface INotificationOptions {
  timeOut: number;
  clickToClose: boolean;
  rtl: boolean;
  animate: NotificationAnimationsType;
  position: ['top' | 'bottom' | 'middle', 'right' | 'left' | 'center'];
}

export class NotificationOptions implements INotificationOptions {
  public timeOut: number;
  public clickToClose: boolean;
  public rtl: boolean;
  public animate: any;
  public position: any;

  constructor(timeOut = 0,
              clickToClose = true,
              animate = NotificationAnimationsType.Scale,
              position = ['top' , 'right'],
              rtl = false) {

    this.timeOut = timeOut;
    this.clickToClose = clickToClose;
    this.animate = animate;
    this.position = position;
    this.rtl = rtl;
  }
}

export interface INotificationBoardOptions {
  rtl: boolean;
  position: ['top' | 'bottom' | 'middle', 'right' | 'left' | 'center'];
  maxStack: number;
  maxLength?: number;
}
