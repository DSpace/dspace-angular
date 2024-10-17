import { NotificationAnimationsType } from './notification-animations-type';

export interface INotificationOptions {
  timeOut: number;
  clickToClose: boolean;
  animate: NotificationAnimationsType | string;
  announceContentInLiveRegion: boolean;
}

export class NotificationOptions implements INotificationOptions {
  public timeOut: number;
  public clickToClose: boolean;
  public animate: any;
  public announceContentInLiveRegion: boolean;


  constructor(
    timeOut = 5000,
    clickToClose = true,
    animate: NotificationAnimationsType | string = NotificationAnimationsType.Scale,
    announceContentInLiveRegion: boolean = true,
  ) {
    this.timeOut = timeOut;
    this.clickToClose = clickToClose;
    this.animate = animate;
    this.announceContentInLiveRegion = announceContentInLiveRegion;
  }
}
