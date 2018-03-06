import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NotificationsService } from '../shared/notifications/notifications.service';
import {
  INotificationBoardOptions,
  NotificationOptions
} from '../shared/notifications/models/notification-options.model';

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  @ViewChild('example') example: TemplateRef<any>;

  constructor(private notificationsService: NotificationsService) {
  }

  createNotification() {
    const n1 = this.notificationsService.success('Welcome in DSpace', 'Good choice!',
      new NotificationOptions(10000, false, 'fromLeft', ['bottom', 'left']));
    // const n2 = this.notificationsService.info('Info in DSpace', 'For your info...!');
    // const n3 = this.notificationsService.warning('Warning in DSpace', 'This is a fake alert!');
    // // const n4 = this.notificationsService.danger(this.example);
    // console.log('Notifications pushed');
    // console.log(n1);
    // console.log(n2);
    // console.log(n3);
    // // console.log(n4);
  }

  createNotification1() {
    const n1 = this.notificationsService.warning('Welcome in DSpace', 'Good choice!',
      new NotificationOptions(10000, false, 'fromLeft', ['bottom', 'left']));
    // const n2 = this.notificationsService.info('Info in DSpace', 'For your info...!');
    // const n3 = this.notificationsService.warning('Warning in DSpace', 'This is a fake alert!');
    // // const n4 = this.notificationsService.danger(this.example);
    // console.log('Notifications pushed');
    // console.log(n1);
    // console.log(n2);
    // console.log(n3);
    // // console.log(n4);
  }

  createNotification2() {
    // const n1 = this.notificationsService.error('Welcome in DSpace', 'Good choice!',
    //   new NotificationOptions(100000, false, 'fromLeft', ['bottom', 'left']));
    // const n2 = this.notificationsService.info('Info in DSpace', 'For your info...!');
    // const n3 = this.notificationsService.warning('Warning in DSpace', 'This is a fake alert!');
    const n4 = this.notificationsService.html(this.example);
    // console.log('Notifications pushed');
    // console.log(n1);
    // console.log(n2);
    // console.log(n3);
    // // console.log(n4);
  }
}
