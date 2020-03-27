import { BrowseByType } from '../../../+browse-by/+browse-by-switcher/browse-by-decorator';
import { NotificationAnimationsType } from './notification-animations-type';

export interface INotificationOptions {
  timeOut: number;
  clickToClose: boolean;
  animate: BrowseByType;
}

export class NotificationOptions implements INotificationOptions {
  public timeOut: number;
  public clickToClose: boolean;
  public animate: any;

  constructor(timeOut = 5000,
              clickToClose = true,
              animate: NotificationAnimationsType | string = NotificationAnimationsType.Scale) {

    this.timeOut = timeOut;
    this.clickToClose = clickToClose;
    this.animate = BrowseByType[animate];
  }
}
